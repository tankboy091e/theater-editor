/* eslint-disable react/no-this-in-sfc */
import { useModalProvider } from 'providers/modal'
import React, {
  createContext, useContext, useState, useEffect,
} from 'react'
import Modal from 'src/components/modal'

type EventHandler = () => void

type Inner =
  | React.ReactNode
  | ((props: { ok?: EventHandler, cancle?: EventHandler }) => React.ReactNode)

interface DialogRequestProps {
  className?: string
}

interface DialogBuilder {
  insert(child: Inner): DialogBuilder
  open(): Promise<boolean>
}

interface DialogProviderContextProps {
  buildDialog: (props? : DialogRequestProps) => DialogBuilder
}

const DialogProviderContext = createContext<DialogProviderContextProps>(null)

export const useDialog = () => useContext(DialogProviderContext)

export default function DialogProvider({
  children,
}: {
  children?: React.ReactNode
}) {
  const [requests, setRequests] = useState<DialogRequest[]>([])
  const { update } = useModalProvider()

  const finishRequest = (request: DialogRequest) => {
    setRequests((array) => array.filter((value) => value !== request))
  }

  class DialogRequest implements DialogBuilder {
    public id: number
    public className: string
    public inner: React.ReactNode
    public executions : {
      ok: EventHandler
      cancle: EventHandler
    }

    constructor(props : DialogRequestProps) {
      this.id = requests.length + 1
      this.className = props?.className
    }

    public insert(inner : Inner): DialogBuilder {
      if (typeof inner === 'function') {
        this.inner = inner({
          ok: () => this.executions.ok(),
          cancle: () => this.executions.cancle(),
        })
        return this
      }
      this.inner = inner
      return this
    }

    public open(): Promise<boolean> {
      return new Promise<boolean>((resolve) => {
        this.executions = {
          ok: () => {
            resolve(true)
            finishRequest(this)
          },
          cancle: () => {
            resolve(false)
            finishRequest(this)
          },
        }
        setRequests((array) => array.concat(this))
      })
    }
  }

  const buildDialog = (props? : DialogRequestProps): DialogBuilder => new DialogRequest(props)

  const value = {
    buildDialog,
  }

  useEffect(() => {
    if (requests.length < 1) {
      update(false)
    }
  }, [requests])

  return (
    <DialogProviderContext.Provider value={value}>
      {children}
      {requests.map(({
        id,
        className,
        inner,
        executions,
      }) => (
        <Modal
          className={className}
          key={id}
          immediate
          onClose={executions.cancle}
        >
          {inner}
        </Modal>
      ))}
    </DialogProviderContext.Provider>
  )
}

DialogProvider.defaultProps = {
  children: null,
}
