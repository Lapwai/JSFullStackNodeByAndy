## Impletement ejs

#### the first "views" is the express option,

#### the second "views" is the folder which contains the .ejs file we want to render

`app.set("views","views") `

#### which templete system(view engine) we want to use

`app.set("view engine", "ejs");`

#### install ejs engin

run `npm install ejs in the terminal`

## Nodemon

1. `npm install nodemon`
2. go to "package.json" file and add one more script `"watch":"nodemon app.js"` right above the "test" script
