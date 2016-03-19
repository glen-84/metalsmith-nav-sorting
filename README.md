# Metalsmith nav sorting

## Installation

```
$ npm install
$ node build.js
```

(view any of the built HTML files under `public/docs`)

## Notes

1. Each time that you build, the navigation items are ordered differently. What does `sortByNameFirst` do exactly?
2. If you add/uncomment `sortBy: "path"` (or `nav_path`), the same thing is true.
3. If you add/uncomment `sortBy: "sort"`, the files in folder `b` appear to be ordered correctly, based on front matter.

## Requirements

1. Control the order of files within folders (the `sort` metadata may work here).
2. Control the order of folders. Folder `b` may need to be displayed above folder `a`.
  * Could this be loaded from a YAML file in each folder? It could also provide a better title, etc.
  * Is there a better way to do this type of thing?
3. In both cases, default to sorting by path.
