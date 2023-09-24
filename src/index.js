const { parse: sfcParse } = require('@vue/compiler-sfc');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');
const logger = require('./logger');
const parseComment = require("./comment");

// 查找所有匹配的注释
const doctags = [];
const genComments = (comments, doc) => {
  // 定义正则表达式来匹配 /** */ 风格的注释
  const commentRegex = /(\/\*\*[\s\S]*?\*\/)/g;
  let match;

  while ((match = commentRegex.exec(doc))) {
    const commentText = match[1].trim();
    const typeRegexStr = "^\\s*\\*\\s*(" + doctags.join("|") + ")$";
    const typeRegex = new RegExp(typeRegexStr, "gm"); // 多个空格* @emits

    const matchResult = typeRegex.exec(commentText);

    if (matchResult) {
      const matchType = matchResult[1];

      if (!comments[matchType]) comments[matchType] = [];

      const result = { source: commentText };
      comments[matchType].push(result);

      parseComment(commentText, result);
    }
  }
};

function extractComments(componentFilePath) {
  const componentContent = fs.readFileSync(componentFilePath, 'utf-8');
  // 解析单文件组件
  const { descriptor, errors } = sfcParse(componentContent, {
    sourceMap: false,
  });

  if (errors.length > 0) {
    logger.error('解析错误：', errors);
    process.exit(1);
  }

  // 从 descriptor 中获取注释、props、emits 和 slots 等信息
  const template = descriptor.template.content ? descriptor.template.content : '';
  const scriptSetup = descriptor.scriptSetup ? descriptor.scriptSetup.content : '';
  const script = descriptor.script ? descriptor.script.content : '';


  const comments = {};
  for (let i = 0; i < doctags.length; i++) {
    comments[doctags[i]] = [];
  }

  const scriptDoc = scriptSetup ? scriptSetup : script;

  genComments(comments, scriptDoc);
  genComments(comments, template);

  return comments;
}

/**
 * 扫描目录并处理组件
 * @param {*} config 
 */
function scanComponents(config) {
  const { folderPath, file } = config.input;
  const componentFiles = glob.sync(file, {
    cwd: path.join(process.cwd(), folderPath),
    absolute: false,
    nodir: true,
    ignore: ['node_modules/**'],
  });

  const allComments = {};

  if (config.output.doctags && Array.isArray(config.output.doctags)) {
    doctags.push(...config.output.doctags);
  } else {
    logger.error('Invalid doctags config.');
    return;
  }

  for (const componentFilePath of componentFiles) {
    const comments = extractComments(path.join(process.cwd(), folderPath, componentFilePath));
    allComments[path.join(folderPath, componentFilePath)] = comments;
  }

  if (config.output.mode === "combine") {
    // 写入到统一的输出文件中
    const { outputDir, outputName } = config.output;
    const outputPath = path.join(process.cwd(), outputDir);
    const outputFile = path.join(outputPath, outputName);
    if (!fs.existsSync(outputPath))
      fs.mkdirSync(outputPath, { recursive: true })
    fs.writeFileSync(outputFile, JSON.stringify(allComments, null, 3));
    logger.log('All Comments are extracted successfully.');
  } else if (config.output.mode === "seperate") {
    for (let fileKey in allComments) {
      const { outputDir } = config.output;
      let filePath = fileKey.substring(0, fileKey.lastIndexOf("/"));
      let fileName = fileKey.substring(fileKey.lastIndexOf("/") + 1);
      const outputPath = path.join(process.cwd(), filePath, outputDir);
      const outputFile = path.join(outputPath, fileName + ".json");
      if (!fs.existsSync(outputPath))
        fs.mkdirSync(outputPath, { recursive: true })
      fs.writeFileSync(outputFile, JSON.stringify(allComments[fileKey], null, 3));
      logger.log(fileName + ' Comments are extracted successfully.');
    }
  }
}

/**
 * 读取配置文件
 * @param {string} filePath 配置路径
 * @returns 配置信息
 */
function readConfig(filePath) {
  if (!filePath) {
    filePath = path.join(process.cwd(), 'jsdoc-comment.yaml');
  } else {
    filePath = path.join(process.cwd(), filePath);
  }
  const configPath = filePath;
  if (!fs.existsSync(configPath)) {
    logger.error('Invalid yaml configuration file.');
    process.exit(1);
  }
  const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

  if (!config.input || !config.output) {
    logger.error('Invalid yaml configuration file.');
    process.exit(1);
  }

  return config;
}


module.exports = {
  scanComponents,
  readConfig
};