// Primera tarea en Gulp

/* function tarea(done){
    console.log("Desde mi primer tarea...");
    done();
}

exports.tarea = tarea; */

// Exportando los módulos para compilar SASS
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
// Dependencias para que el proyecto sea compatible con la mayoria de navegadores.
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");
// Dependencia para evitar que se detenga la observación
const plumber = require("gulp-plumber");
// Dependencias de imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");



// Función para compilar SASS
function css(done){
    // Primero ubicamos el archivo principal .scss
    src("src/scss/app.scss")
    // Iniciamos el mapeo de busqueda.
    .pipe(sourcemaps.init())
    // Evitamos que se detenga la observación 
    .pipe(plumber())
    // Segundo compilamos el archivo .scss a .css
    .pipe(sass(/* {outputStyle: 'compressed'} */))
    // modifica el código compilado para que sea compatible con la mayoria de navegadores web.
    .pipe(postcss([autoprefixer(), cssnano()]))
    // Guardamos el mapeo de busqueda 
    .pipe(sourcemaps.write("."))
    // Por último almacenamos la compilación en un archivo .css
    .pipe(dest("build/css"))
    //Función callback
    done();
}

// Tarea para JavaScript
function JavaScript(){
    return src("src/js/*.js")
    .pipe(dest("build/js"))
}

// tarea para convertir imagenes de jpg a avif o webp

function imagenes(done){
    // Primero identificamos las imagenes
    src("src/img/**/*")
    // Aligerar imagenes con imagemin
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 5})
    ]))
    // Movemos las imagenes a otra carpeta
    .pipe(dest("build/img"))
    done();
}


// Tarea para que este al pendiente de los cambios realizados en tiempo real
function dev(done){
    watch("src/scss/**/*.scss", css);
    // Solo va a prestar atencion a los movimientos de un archivo.
    /* watch("src/scss/app.scss", css); */
    // watch de las imagenes
    watch("src/img/**/*", imagenes);
    done();
}

// Tarea para convertir webp
function imagenwebp(done){
       // crear una version más ligera  de Webp
    const opciones={
        quality: 50
    }
    // Buscamos las imagenes con formato jpg o png
    src("src/img/**/*.{png,jpg}")
    // Aplicamos la conversion a webp a las imagenes
    .pipe(webp(opciones))
    // Guardamos las imagenes en formato webp
    .pipe(dest("build/img"))
    done();
}

// Tarea para convertir imagen jpg o png a avif
function imagenAvif(done){
    // crear una version más ligera  de Avif
    const opciones={
        quality: 50
    }
    //Buscamos las imagenes jpg o png
    src("src/img/**/*.{png,jpg}")
    // Convertimos las imagenes a Avif
    .pipe(avif(opciones))
    // Guardamos las imagenes convertidas en Avif
    .pipe(dest("build/img"))
    done();
}

// Llamamos a la tareas

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.imagenwebp = imagenwebp;
exports.imagenAvif = imagenAvif;
exports.JavaScript = JavaScript;
// exports por defecto, solo se requiere escribir gulp para ejecutar la tarea.
exports.default = series(imagenes, imagenwebp, imagenAvif, css, dev);

// Deployment del proyecto
exports.build = series( css, JavaScript);