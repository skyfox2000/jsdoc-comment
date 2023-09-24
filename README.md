# JsDoc格式Vue文档生成工具

## 项目功能 🔨

`jsdoc-comment` 是一个基于 Node.js 开发的工具，根据 YAML 配置，自动生成包含注释内容的JSON数据，方便二次加工处理。

## 安装使用步骤

### 安装

你可以使用 npm 或 yarn 来安装 `jsdoc-comment`:

```bash
npm install -D jsdoc-comment
# 或者
yarn add -D jsdoc-comment
```

### 使用

```yaml
# 配置文件默认路径为 /jsdoc-comment.yaml
# 可通过命令行参数 -c /path/to/config.yaml 指定配置文件位置
input:
   folderPath: "/src/components" # 指定需处理的组件所在文件夹路径
   file: "**/src/*.vue" # 指定组件文件名

output:
   # 输出mode有2种方式：
   # 1、 seperate 在组件的目录为基准，以下面的输出目录为相对目录，生成以组件名+.json的文件
   # 2、 combine 以下面配置的路径和文件将所有组件信息写在统一的json文件中
   mode: seperate # 默认
   doctags: # 定义需要输出到文档的标签类型，
      # JsDoc格式必须是
      # /**
      #  * @component/@props/@emits/@slots 后面不要加其它内容
      #  * @name 等等其它标签
      # */
      - "@component" # 组件注释
      - "@props" # 属性注释
      - "@emits" # 事件注释
      - "@slots" # 插槽注释
   outputDir: "../docs/" # 指定输出目录  combine时，目录从根目录算，seperate时，目录是根据组件所在位置的相对位置
   outputName: "comments.json" # combine时，指定输出文件名，seperate时无效
```

在 `package.json` 中添加以下脚本：

```json
"scripts": {
  "jsdoc": "jsdoc-comment [-c config.yaml]"  /// [-c config.yaml] 可选
}
```

然后，你可以运行以下命令来生成注释Json：
```bash
npm run jsdoc
# 或者
yarn jsdoc
```

### 详细配置参数说明
`input` （必填），输入配置。
- `folderPath`（必填）: 指定需处理的组件所在文件夹路径

- `file`（必填）: 指定组件文件名，支持**和*

`output` 输出配置：

- `mode`: （必填）输出mode有2种方式：
   - 1、 seperate 在组件的目录为基准，以下面的输出目录为相对目录，生成以组件名+.json的文件
   - 2、 combine 以下面配置的路径和文件将所有组件信息写在统一的json文件中

- `doctags`（必填）: 定义需要输出到文档的标签类型

- `outputDir`（必填）: 指定输出目录 
  -  combine时，目录从根目录算，
  -  seperate时，目录是根据组件所在位置的相对位置

- `outputName`（可选）: 输出文件名
  - combine时，指定输出文件名，
  - seperate时，无效
  
## Git commit ⻛格指南

- feat: 增加新功能
- fix: 修复问题
- style: 代码⻛格相关⽆影响运⾏结果的
- perf: 优化/性能提升
- refactor: 重构
- revert: 撤销修改
- test: 测试相关
- docs: ⽂档/注释
- chore: 依赖更新/脚⼿架配置修改等
- ci: 持续集成

## 许可证

该项目基于 MIT 许可证进行分发。更多详情请参阅 [LICENSE](LICENSE) 文件。
