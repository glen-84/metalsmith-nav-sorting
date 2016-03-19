"use strict";

const handlebars = require("handlebars");
const hljs = require("highlight.js");
const layouts = require("metalsmith-layouts");
const markdown = require("metalsmith-markdown-remarkable");
const metalsmith = require("metalsmith");
const navigation = require("metalsmith-navigation");

// http://stackoverflow.com/a/16315366/221528
handlebars.registerHelper("ifx", (v1, operator, v2, options) => {
    switch (operator) {
        case "==":
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case "===":
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

// Build docs.
metalsmith(__dirname)
    .source("src/docs")
    .destination("public/docs")
    .ignore(".gitignore")
    .use(markdown({
        highlight: (str, lang) => {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (err) {
                    // Ignore.
                }
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) {
                // Ignore.
            }

            return "";
        },
        html: true,
        linkify: true,
        typographer: true,
        quotes: "“”‘’",
        xhtmlOut: true
    }))
    .use(navigation({
        navConfigs: {
            main: {
                includeDirs: true,
                sortByNameFirst: true,
                //sortBy: "path",
                //sortBy: "sort"
            }
        }
    }))
    // Make sure that each item has a title.
    .use((files, metalsmith, done) => {
        // Create a default title for a file or directory name.
        const defaultTitle = ((name) => {
            name = name.replace(/-/g, " ");

            return name.charAt(0).toUpperCase() + name.substr(1);
        });

        const processItems = ((items) => {
            for (let item of items) {
                if (item.type === "dir") {
                    item.title = defaultTitle(item.name);
                } else if (item.type === "file") {
                    if (item.file.title) {
                        item.title = item.file.title;
                    } else {
                        // Remove file extension.
                        const name = item.name.substring(0, item.name.lastIndexOf("."));

                        item.title = defaultTitle(name);
                    }
                }

                if (item.children) {
                    processItems(item.children);
                }
            }
        });

        processItems(metalsmith.metadata().navs.main);

        done();
    })
    .use(layouts({
        engine: "handlebars",
        default: "main.hbs",
        directory: "src/templates/layouts",
        pattern: "**/*.html",
        partials: "src/templates/partials"
    }))
    .build((err) => {
        if (err) {
            throw err;
        }
    });
