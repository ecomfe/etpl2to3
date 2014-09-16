# etpl2to3

[![Build Status](https://travis-ci.org/ecomfe/etpl2to3.svg?branch=master)](https://travis-ci.org/ecomfe/etpl2to3)

`etpl2to3` 是一个将 `ETpl 2` 模板语法转换成 `ETpl 3` 的工具。

[ETpl](http://ecomfe.github.io/etpl/) 是一个灵活、具有强大复用能力的高性能的模板引擎，适用于WEB前端应用中视图的生成，特别是SPA(Single Page APP)类型的应用。

## 安装


```
$ sudo npm install -g etpl2to3
```

## 使用

直接输入 `etpl2to3` 可以看到详细的帮助信息。

```
$ etpl2to3

  Usage: etpl2to3 <input file/directory> [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -o, --output <output>    Output file or directory
    -e, --extname <extname>  Tpl file extname, use when input is directory. Default ".tpl.html"
    --override               Override when output file exists
```

通过 `etpl2to3` 可以转换一个模板文件，也可以通过指定扩展名，批量转换一个目录下的所有模板文件。

#### 转换一个文件

```
$ etpl2to3 tplfile -o newtplfile
```

#### 转换一个文件 (如果-o文件存在时，覆盖它)

```
$ etpl2to3 tplfile -o newtplfile --override
```

#### 转换一个文件，直接覆盖当前文件

指定`输入文件`和`输出文件`相同时，将直接覆盖当前文件。不推荐这种方式。如果你的文件没有使用版本管理，千万不要这样做。

```
$ etpl2to3 src-directory -o src-directory --override
```

#### 转换一个目录

```
$ etpl2to3 src-directory -o new-src-directory
```

#### 转换一个目录 (如果-o目录存在时，覆盖它)

```
$ etpl2to3 src-directory -o new-src-directory --override
```

#### 转换一个目录，直接覆盖当前文件

指定`输入目录`和`输出目录`相同时，将直接覆盖当前文件。不推荐这种方式。如果你的文件没有使用版本管理，千万不要这样做。

```
$ etpl2to3 src-directory -o src-directory --override
```


