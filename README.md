<br>

## __Documentation__
### [main docs](/docs/main.md)

<br>

## __Naming Convention__
### Javscript & Typescript
|Name|Convention|
|---|---|
|file|kebab-case|
|function|camelCase|
|variable|camelCase|
|constant|UPPER_SNAKE_CASE|
|interface|PascalCase|
|class|PascalCase|
|component|PascalCase|
|type|PascalCase|
|enum|Don't use it. Use string union|

### Sass

|Name|Convention|
|---|---|
|local variable|kebab-case|
|Global variable|G-kebab-case|
|keyframes|kebab-case|
|selector|camelCase|
|mixin|camelCase|
|function|camelCase|

<br>

## __Directory Structure__
## /pages
Import Layout, and inject into it components like header, navigation, and templates or something.
Component's name should be 'Page' excluding _app.tsx, _document.tsx, _error.tsx, etc.
## /public
Locate static file in here. The directory name must not be changed.
+ ### /icons
+ ### /images
+ ### /fonts
+ ### /videos
+ ### favicon.ico
+ ### robots.txt
+ ### sitemap.xml
## /src
Mainly we write code in here.
+ ### /widgets
    + For the tiny component.
    + Example :  ```<CustomImage />```
+ ### /components
    + The storage for reusable materials.
    + Example : ```<Article />```
+ ### /providers
    + Write global context API of React.js.
    + It is for dealing with Global data like an authentication.
    + But you can also use the Context API for lifting state up from children you can't expect.
    + Example : ```<ModalProvider></ModalProvider>```
+ ### /templates
    + Main View composed of complex components.
    + It will be needed when we make have to make them communicate between header and main elements, and nav with footer but we don't want to write complex code in /pages.
    + Example : ```<Home />```
+ ### /layouts
    + The skeleton of a page. 
    + It defines relationship among header, main, bottom, etc.
## /sass
Write CSS.
Maybe you can make another /components, /layout, /providers under this directory just like /src.
+ ### /lib
    + Utility sass functions
    + Colors
    + Variables
    + Mediaquery
+ ### /animataons
    + Common animations
## /lib
Write utility functions like fetcher, date convert, and whatever.
+ ### /api
    + For fetching data.
+ ### /config
    + For constant variables on global environment.
+ ### /hooks
    + For React.js custom hooks.
+ ### /server
    + For serverSideFunctions working in getStaticProps, getServerSideProps and so on.
+ ### /util
    + For any utility functions.
