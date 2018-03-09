/**
 * PToast  弹框插件
 * @author Rowbiy
 * @return {}
 **/
;(function() {
  "use strict";
  function PToast () {
    let defaultOpts = {
      title: '',                     //标题
      desc: '',                      //内容文字
      effect: 'shake',               //出现效果，默认闪动
      tipCloseTime: 2000,            //tip框自动关闭时间，单位毫秒
      ok: '确定',                     //默认确定按钮
      payAction: '',                 //支付框动作按钮
      payCallback: function() {},    //支付框动作按钮回调
      blankClose: false,             //空白处点击关闭
      okCallback: function() {},     //确定回调
      cancel: '取消',
      cancelCallback: function() {}  //取消回调
    };
    //配置基础样式以及动画
    let cssArr = [
      ".ptoast-masker{background-color:rgba(0, 0, 0, 0.4);position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index: 10000}",
      ".ptoast-box{box-sizing:border-box;background:#fff;position: absolute;left:50%;top:35%;width:440px;border-radius:4px;margin-left:-240px;overflow:hidden;z-index:99999;-webkit-animation: showPToast .15s;font-family:'Microsoft YaHei';}",
      ".ptoast-title{box-sizing:border-box;background:#f6f6f6;width:100%;height:40px;font-size:16px;line-height:40px;overflow:hidden;text-align:center;color:#394d62;-webkit-user-select:none;text-overflow:ellipsis;white-space:nowrap;padding:0 40px;}",
      ".ptoast-desc{word-wrap:break-word;word-break:break-all;background:#fff;box-sizing:border-box;width:100%;padding:40px 30px;font-size:16px;line-height:25px;overflow:hidden;max-height:200px;color:#4A5A65;}",
      ".ptoast-sure-btn{background:#2bcda5;margin-bottom:20px;width:28%;margin-left:36%;height:35px;line-height:35px;text-align:center;overflow:hidden;color:#fff;cursor:pointer;font-size:16px;border-radius:3px;-webkit-user-select:none;}",
      ".ptoast-sure-btn:hover, .ptoast-btn-ok:hover, .ptoast-pay-btn:hover{background: #1cb19f;}",
      ".ptoast-close-btn{position:absolute;left:100%;top:0;cursor:pointer;margin-left:-32px;margin-top:2px;}",
      ".ptoast-pay-box .ptoast-close-btn{margin-top:7px;margin-left:-35px;}",
      ".ptoast-close-btn::before{content:'\\00D7';font-size: 28px;color:#aaa;}",
      ".ptoast-close-btn:hover::before{color:#1cb19f;font-weight:700;}",
      ".ptoast-btn-container{display:flex;display:-webkit-flex;padding-bottom:20px;}",
      ".ptoast-btn-cancel{width:100px;height:35px;line-height:35px;background:#d3d3d3;text-align:center;margin-left:100px;overflow:hidden;color:#fff;cursor:pointer;font-size:16px;border-radius:3px;-webkit-user-select:none;}",
      ".ptoast-btn-ok{width:100px;height:35px;line-height:35px;background:#2bcda5;text-align:center;margin-left:40px;overflow:hidden;color:#fff;cursor:pointer;font-size:16px;border-radius:3px;-webkit-user-select:none;}",
      ".ptoast-btn-cancel:hover{background: #bbb;}",
      ".ptoast-tip-box{box-sizing:border-box;background:#fff;position:absolute;left:50%;top:10%;width:280px;border-radius:4px;margin-left:-140px;overflow:hidden;z-index:99999;-webkit-animation:showPToast 0.3s;font-family:'Microsoft YaHei';padding:20px;text-align:center;font-size:16px;border-bottom:1px solid #1Cb19F;word-break:break-all;box-shadow:2px 2px 10px 1px rgba(0,0,0,.18);color:#4A5A65}",
      ".ptoast-tip-hide{-webkit-animation: hidePTip .3s;}",
      "@-webkit-keyframes showPToast{0%{transform: scale(.75);-webkit-transform: scale(.5);}100%{transform: scale(1);-webkit-transform: scale(1);}}",
      "@-webkit-keyframes hidePTip{0%{transform:scale(1);-webkit-transform:scale(1);}100%{transform:scale(0);-webkit-transform:scale(0);}}",
      ".ptoast-pay-box{box-sizing:border-box;background:#fff;position:absolute;left:50%;top:32%;width:500px;border-radius:4px;margin-left:-250px;overflow:hidden;z-index:99999;-webkit-animation: showPToast .15s;}",
      ".ptoast-pay-icon-success{position:relative;width:50px;height:50px;background:#2bcda5;margin:50px auto 20px auto;border-radius:50%;}",
      ".ptoast-pay-icon-success::before{content:'';position:absolute;height:16px;width:5px;background:#fff;left:16px;top:22px;transform:rotate(-47deg);}",
      ".ptoast-pay-icon-success::after{content:'';position:absolute;height:26px;width:5px;background:#fff;left:28px;top:14px;transform:rotate(40deg);}",
      ".ptoast-pay-title{font-family:PingFangSC-Medium;font-size:16px;color:#333333;line-height:24px;text-align:center;}",
      ".ptoast-pay-desc{font-family:PingFangSC-Regular;font-size:12px;color:#999999;line-height:24px;text-align:center;}",
      ".ptoast-pay-btn{background:#2bcda5;border-radius:2px;height:35px;line-height:35px;margin:35px auto;font-family:PingFangSC-Semibold;font-size:14px;color:#fff;text-align:center;cursor:pointer;box-sizing:border-box;max-width:120px;min-width:70px;padding:0 15px;}"
    ]
    let showPToast = cssArr.join("");

    //将样式和动画写入head头
    if (document.getElementsByTagName("style").length) {
      document.getElementsByTagName("style")[0].innerHTML += showPToast;
    } else {
      let style = document.createElement("style");
      style.innerHTML = showPToast;
      document.getElementsByTagName("head")[0].appendChild(style);
    }

    //alert框
    this.alert = function (opts) {
      let o = {};
      if (arguments.length === 2) {
        if ((typeof arguments[0] === "string") && (typeof arguments[1] === "string")) {
          o['title'] = arguments[0];
          o['desc'] = arguments[1];
        } else {
          throw Error('alert参数设置不正确!');
        }
      } else if (arguments.length === 1) {
        if (typeof opts === "string") {
          o['desc'] = arguments[0];
        } else {
          o = opts;
        }
      }
      fillBaseBox(o, true);
    }

    //tip弹框
    this.tip = function (str) {
      //创建弹出层父div
      let pToastParentDiv = document.createElement("div");
      pToastParentDiv.className = "ptoast-masker";
      //创建tip框div
      let tipBox = document.createElement("div");
      tipBox.className = "ptoast-tip-box";
      tipBox.innerText = str + "";
      tipBox.classList.remove("ptoast-tip-hide");
      document.body.appendChild(tipBox);
      setTimeout(function () {
        tipBox.classList.add("ptoast-tip-hide");
      }, defaultOpts['tipCloseTime']);
      setTimeout(function () {
        document.body.removeChild(tipBox);
      }, defaultOpts['tipCloseTime'] + 250);
    }

    //支付成功弹框
    this.paySuccess = function (title, desc, btnText, callBack) {
      let opt = {};
      opt['title'] = title;
      opt['desc'] = desc;
      opt['payAction'] = btnText;
      opt['payCallback'] = callBack;
      fillPayBox(opt, true);
    }

    //confirm确认框
    this.confirm = function (opts) {
      let o = {};
      if (arguments.length === 2) {
        if ((typeof arguments[0] === "string") && (typeof arguments[1] === "string")) {
          o['title'] = arguments[0];
          o['desc'] = arguments[1];
        } else if ((typeof arguments[0] === "string") && (typeof arguments[1] === "function")) {
          o['desc'] = arguments[0];
          o['okCallback'] = arguments[1];
        } else {
          throw Error('confirm参数设置不正确!');
        }
      } else if (arguments.length === 3) {
        if ((typeof arguments[0] === "string") && (typeof arguments[1] === "function") && (typeof arguments[2] === "function")) {
          o['desc'] = arguments[0];
          o['okCallback'] = arguments[1];
          o['cancelCallback'] = arguments[2];
        } else {
          throw Error('confirm参数设置不正确!');
        }
      } else if (arguments.length === 4) {
        if ((typeof arguments[0] === "string") && (typeof arguments[1] === "string") && (typeof arguments[2] === "function") && (typeof arguments[3] === "function")) {
          o['title'] = arguments[0];
          o['desc'] = arguments[1];
          o['okCallback'] = arguments[2];
          o['cancelCallback'] = arguments[3];
        } else {
          throw Error('confirm参数设置不正确!');
        }
      } else {
        if (typeof opts === "string") {
          o['desc'] = arguments[0];
        }
      }
      (o === {}) ? fillBaseBox(opts, false) : fillBaseBox(o, false);
    }

    //绘制支付框实体方法
    let fillPayBox = function (opts) {
      //创建弹出层父div
      let pToastParentDiv = document.createElement("div");
      pToastParentDiv.className = "ptoast-masker";
      //创建支付框div
      let payBox = document.createElement("div");
      payBox.className = "ptoast-pay-box";
      let paramsObj = {}; //真正存储配置的对象，不能改变defaultOpts
      paramsObj = Object.assign({}, defaultOpts, opts);
      let iconLine = document.createElement("div");
      iconLine.className = "ptoast-pay-icon-success";
      payBox.appendChild(iconLine);

      let titleLine = document.createElement("div");
      titleLine.className = "ptoast-pay-title";
      titleLine.innerText = paramsObj['title'];
      payBox.appendChild(titleLine);

      let contentLine = document.createElement("div");
      contentLine.className = "ptoast-pay-desc";
      contentLine.innerText = paramsObj['desc'];
      payBox.appendChild(contentLine);

      let buttonLine = document.createElement("div");
      buttonLine.className = "ptoast-pay-btn";
      buttonLine.innerText = paramsObj['payAction'];
      buttonLine.addEventListener('click', function (e) {
        paramsObj['payCallback']();
        document.body.removeChild(e.target.parentNode.parentNode);
      });
      payBox.appendChild(buttonLine);

      let closeBtn = document.createElement("div");
      closeBtn.className = "ptoast-close-btn";
      closeBtn.addEventListener('click', function (e) {
        document.body.removeChild(e.target.parentNode.parentNode);
      });
      //允许点击空白处关闭弹出层事件
      if (paramsObj.blankClose) {
        pToastParentDiv.addEventListener('click', function (e) {
          if (e.target.className === "ptoast-masker") {
            document.body.removeChild(e.target);
            e.stopPropagation();
            e.preventDefault();
          }
        });
      }
      payBox.appendChild(closeBtn);
      pToastParentDiv.appendChild(payBox);
      document.body.appendChild(pToastParentDiv);
    }

    //绘制alert框及confirm框实体方法
    let fillBaseBox = function (opts, singleType) {
      //创建弹出层父div
      let pToastParentDiv = document.createElement("div");
      pToastParentDiv.className = "ptoast-masker";
      //创建alert框div
      let alertBox = document.createElement("div");
      alertBox.className = "ptoast-box";

      let paramsObj = {}; //真正存储配置的对象，不能改变defaultOpts
      if (typeof opts === "object") {
        paramsObj = Object.assign({}, defaultOpts, opts);
      } else {
        defaultOpts['desc'] = opts;
        paramsObj = Object.assign({}, defaultOpts);
      }
      if (paramsObj['title']) {
        let titleLine = document.createElement("div");
        titleLine.className = "ptoast-title";
        titleLine.innerText = paramsObj['title'];
        alertBox.appendChild(titleLine);
      }
      let contentLine = document.createElement("div");
      contentLine.className = "ptoast-desc";
      if (!paramsObj['desc']) {
        contentLine.innerText = 'PToast提示：未设置desc内容';
        console.warn("PToast提示：未设置desc内容");
      } else {
        contentLine.innerText = paramsObj['desc'];
      }
      alertBox.appendChild(contentLine);
      //允许点击空白处关闭弹出层事件
      if (paramsObj.blankClose) {
        pToastParentDiv.addEventListener('click', function (e) {
          if (e.target.className === "ptoast-masker") {
            document.body.removeChild(e.target);
            e.stopPropagation();
            e.preventDefault();
          }
        });
      }
      if (singleType) { //单个确定按钮类型
        let buttonLine = document.createElement("div");
        buttonLine.className = "ptoast-sure-btn";
        buttonLine.innerText = paramsObj['ok'];
        buttonLine.addEventListener('click', function (e) {
          document.body.removeChild(e.target.parentNode.parentNode);
        });
        alertBox.appendChild(buttonLine);
      } else { //带取消按钮类型
        let buttons = document.createElement("div");
        let buttonLeft = document.createElement("div");
        let buttonRight = document.createElement("div");
        buttons.className = "ptoast-btn-container";
        buttonLeft.className = "ptoast-btn-cancel";
        buttonRight.className = "ptoast-btn-ok";
        buttonRight.innerText = paramsObj['ok'];
        buttonLeft.innerText = paramsObj['cancel'];
        buttons.appendChild(buttonLeft);
        buttons.appendChild(buttonRight);
        buttonLeft.addEventListener('click', function (e) {
          paramsObj['cancelCallback']();
          document.body.removeChild(e.target.parentNode.parentNode.parentNode);
        });
        buttonRight.addEventListener('click', function (e) {
          paramsObj['okCallback']();
          document.body.removeChild(e.target.parentNode.parentNode.parentNode);
        });
        alertBox.appendChild(buttons);
      }
      let closeBtn = document.createElement("div");
      closeBtn.className = "ptoast-close-btn";
      closeBtn.addEventListener('click', function (e) {
        document.body.removeChild(e.target.parentNode.parentNode);
      });
      alertBox.appendChild(closeBtn);
      if (document.getElementsByClassName("ptoast-masker").length >= 1) {
        pToastParentDiv.style.cssText += ";background-color: transparent;";
      }
      pToastParentDiv.appendChild(alertBox);
      document.body.appendChild(pToastParentDiv);
    }
  }

  let unique = new PToast();
  //兼容模块
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = unique;
  } else { window.PToast = unique; }
}());
