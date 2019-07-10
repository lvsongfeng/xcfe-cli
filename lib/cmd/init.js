// init 操作命令行
const exec = require('child_process').exec
const ora = require('ora')
const inquirer = require('inquirer');
const download = require('download-git-repo');

const tip = require('../tip')

const spinner = ora()
spinner.color = 'green';
// 下载模板
const downLoadTemplate = (projectName, templateType) => {
  const TYPE_MAP = {
    vue: 'https://github.com/zhouyupeng/vue-cli3-H5.git#master',
    gulp: 'https://github.com/weibsgz/gulp-demo.git#master',
    ie8: 'https://github.com/weibsgz/webpack-library.git#master',
    multiplePage: 'https://github.com/weibsgz/webpack-multiple.git#master'
  }
  download(`direct:${TYPE_MAP[templateType]}`, `${process.cwd()}/${projectName}`, {
    clone: true
  }, function (err) {
    console.log(err ? err : '')
    spinner.stop()
    tip.suc(`模板已创建成功~~`)
  })
}
// 生成模板
const selectTemplate = (projectName) => {
  const temQuestions = [{
    type: 'list',
    name: 'type',
    message: '请选择要生成的模板类型?',
    choices: [
      'vue-webpack 模板',
      'gulp-jquery 模板',
      'ie8-webpack 模板',
      'multiplePage-webpack 模板',
    ],
    filter: function (val) {
      return val.split('-')[0];
    }
  }]
  inquirer
    .prompt(temQuestions)
    .then(answers => {
      downLoadTemplate(projectName, answers.type)
      spinner.start(`正在生成 ${answers.type} 模板...`)
    });
}
// 生成项目
const createProject = () => {
  const questions = [{
    type: 'input',
    name: 'projectName',
    message: "项目(项目文件夹)名称:"
  }, ]
  inquirer.prompt(questions).then(answers => {
    const currentPath = process.cwd()
    const cmdStr = `cd ${currentPath} && mkdir ${answers.projectName} && cd ${answers.projectName}`
    exec(cmdStr, (err) => {
      if (err) {
        tip.fail('创建文件夹存在相同文件夹名')
        console.log(err);
        process.exit()
      }
      selectTemplate(answers.projectName)
    })
  });
}
module.exports = () => {
  createProject()
}