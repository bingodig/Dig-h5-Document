'use strict';

require.config({
  baseUrl: 'bower_components',
  paths: {
    jquery: 'jquery/dist/jquery'
  },
  packages: [
    {
      name: 'zrender',
      location: 'zrender/src/',
      main: 'zrender'
    }
  ]
});


require(
  [
    'jquery',
    'zrender',
    'zrender/shape/Rose',
    'zrender/shape/Trochoid',
    'zrender/shape/Circle',
    'zrender/shape/Sector',
    'zrender/shape/Ring',
    'zrender/shape/Ellipse',
    'zrender/shape/Rectangle',
    'zrender/shape/Text',
    'zrender/shape/Heart',
    'zrender/shape/Droplet',
    'zrender/shape/Line',
    'zrender/shape/Image',
    'zrender/shape/Star',
    'zrender/shape/Isogon',
    'zrender/shape/BezierCurve',
    'zrender/shape/Polyline',
    'zrender/shape/Path',
    'zrender/shape/Polygon',
    'zrender/tool/util',
    'zrender/Group',
    'zrender/animation/Animation',
    'zrender/Painter',
    "zrender/Storage"
  ], function($, zrender){
    var Util = require('zrender/tool/util');
    var Animation = require('zrender/animation/Animation');
    //var Painter = require('zrender/Painter');
    //var Storage = require("zrender/Storage");

    var CircleShape = require('zrender/shape/Circle');
    var PathShape = require('zrender/shape/Path');
    var RectangleShape = require('zrender/shape/Rectangle');
    var TextShape = require('zrender/shape/Text');
    var PolylineShape = require('zrender/shape/Polyline');
    var Group = require('zrender/Group');

    var color = require('zrender/tool/color');
    var colorIdx = 0;

    // 初始化zrender
    var zr = zrender.init(document.getElementById("canvasEl2"));
    //zr.clear();
    //window.zrPainter = new Painter(zr, new Storage());
    /*
     *********************************** 设置一些常量 begin ************************************
     */

    var animDuration_default = 500;                  // 默认动画时长
    var opacity_default = 1;
    var hoverable_default = false;

    var channelGapLength = 5;            // 各渠道图形之间的间隙

    var colorBorder = '#999999';        // 杯壁颜色
    var colorL1Default = '#FFFF99';     // 第一层默认颜色
    var colorL2Default = '#99FF99';     // 第二层默认颜色
    var colorL3Default = '#66CCFF';     // 第三层默认颜色

    var colorsL1Active = ['#66CCFF', '#99FF99', '#FFFF99'];    // 第一层动画状态下颜色数组
    var colorsL2Active = ['#66CCFF', '#99FF99', '#FFFF99'];    // 第二层动画状态下颜色数组
    var colorsL3Active = ['#66CCFF', '#99FF99', '#FFFF99'];    // 第三层动画状态下颜色数组

    // 字体相关

    var font_fill_value = '#6699FF';                // 针对数值text的颜色，如“80%”
    var font_fill_text = '#aaa';                          // 针对文字说明text的颜色，如“转化”
//    var font_fill_text = 'white';                          // 针对文字说明text的颜色，如“转化”
    var font_fill_layerConversion_text = '#aaa';                          // 针对文字说明text的颜色，如“转化”

    var font_weight_normal = '600';
    var font_weight_value = '700';

    var font_size_normal = '13';
    var font_size_channelValue = '18';

    var font_size_channelTransformValue = '16';


    var flag_App = true;
    var flag_WeiXin = true;
    var flag_Network = true;


    /*
     *********************************** 设置一些常量 end ************************************
     */

    // 杯壁的坐标，path信息集合
    var borderCoordinate = [];
    borderCoordinate.push({
      layer: 1,
      leftPathStr: 'M65.653,116.629C58.074,92.617,49.524,70.409,40.002,50.005',
      rightPathStr: 'M360,50C350.478,70.404,341.928,92.612,334.349,116.624',
      leftTopX: 40.002,
      leftTopY: 50.005,
      leftBottomX: 65.653,
      leftBottomY: 116.629,
      rightTopX: 360,
      rightTopY: 50,
      rightBottomX: 334.349,
      rightBottomY: 116.624
    });
    borderCoordinate.push({
      layer: 2,
      leftPathStr: 'M96.771,261.122C90.272,213.394,81.379,170.113,70.091,131.279',
      rightPathStr: 'M329.912,131.27C318.622,170.11,309.727,213.399,303.227,261.137',
      leftTopX: 70.091,
      leftTopY: 131.279,
      leftBottomX: 96.771,
      leftBottomY: 261.122,
      rightTopX: 329.912,
      rightTopY: 131.27,
      rightBottomX: 303.227,
      rightBottomY: 261.137
    });
    borderCoordinate.push({
      layer: 3,
      leftPathStr: 'M110,480C110,405.135,106.247,337.24,98.74,276.316',
      rightPathStr: 'M301.26,276.316C293.753,337.24,290,405.135,290,480',
      leftTopX: 98.74,
      leftTopY: 276.316,
      leftBottomX: 110,
      leftBottomY: 480,
      rightTopX: 301.26,
      rightTopY: 276.316,
      rightBottomX: 290,
      rightBottomY: 480
    });


    // 杯壁 zr实例
    var pathLeftBorder1 = new PathShape({
      style : {
        path : 'M20,50C29.522,70.404,38.072,92.612,45.651,116.624L65.653,116.629M65.653,116.629C58.074,92.617,49.524,70.409,40.002,50.005L20,50',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    })

    var pathRightBorder1 = new PathShape({
      style : {
        path : 'M360,50C350.478,70.404,341.928,92.612,334.349,116.624L354.349,116.629M354.349,116.624C361.928,92.612,370.478,70.404,380,50L360,50',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    });

    var pathLeftBorder2 = new PathShape({
      style : {
        path : 'M50.088,131.27C61.378,170.11,70.273,213.399,76.773,261.137L96.771,261.122M96.771,261.122C90.272,213.394,81.379,170.113,70.091,131.279L50.088,131.27',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    });

    var pathRightBorder2 = new PathShape({
      style : {
        path : 'M329.912,131.27C318.622,170.11,309.727,213.399,303.227,261.137L323.229,261.122M323.229,261.122C329.728,213.394,338.621,170.113,349.909,131.279L329.912,131.27',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    });

    var pathLeftBorder3 = new PathShape({
      style : {
        path : 'M78.74,276.311C86.246,337.235,90,405.128,90,479.991L110,480M110,480C110,405.135,106.247,337.24,98.74,276.316L78.74,276.311',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    });

    var pathRightBorder3 = new PathShape({
      style : {
        path : 'M301.26,276.316C293.753,337.24,290,405.135,290,480L310,480M310,480C310,405.135,313.753,337.24,321.26,276.316L301.26,276.316',
        brushType : 'both',
        color : '#999999'
      },
      hoverable: hoverable_default
    });


    // 下转箭头和转化区域信息
    var arrowGapHeight = 15;                             // 箭头的间隔
    var arrowColor = '#6699FF';                         // 箭头的填充颜色
//window.ggg = [];

    /**
     * 创建层次向下转化区域的元素
     * 参数：
     * pX x坐标
     * pY y坐标
     */
    function createLayerConversionEls(pX, pY, text){
      pX = pX -15;
      pY = pY -30 ;
      // part1 箭头组 动画
      // 总高度 12，总宽度 12
      var arrowPath = new PathShape({
        style : {
          path : 'M5,5h6v6,h3l-6,6l-6,-6h3Z',
          color : arrowColor,
          opacity: 0
        },
        hoverable: hoverable_default,
        zlevel: 2
      });
      var arrowPath2 = new PathShape({
        style : {
          path : 'M5,20h6v6,h3l-6,6l-6,-6h3Z',
          color : arrowColor,
          opacity: 0.2
        },
        hoverable: hoverable_default,
        zlevel: 2
      });
      var arrowPath3 = new PathShape({
        style : {
          path : 'M5,35h6v6,h3l-6,6l-6,-6h3Z',
          color : arrowColor,
          opacity: 1
        },
        hoverable: hoverable_default,
        zlevel: 2
      });
      var arrowPath4 = new PathShape({
        style : {
          path : 'M5,50h6v6,h3l-6,6l-6,-6h3Z',
          color : arrowColor,
          opacity: 1
        },
        hoverable: hoverable_default,
        zlevel: 2
      });
      var arrowPath5 = new PathShape({
        style : {
          path : 'M5,65h6v6,h3l-6,6l-6,-6h3Z',
          color : arrowColor,
          opacity: 0.2
        },
        hoverable: hoverable_default,
        zlevel: 2
      });

      // 加入到Group中
      var arrowG = new Group();
      arrowG.position[0] = pX;                 // 跳转Group的位置
      arrowG.position[1] = pY;
      arrowG.zlevel = 2;
      arrowG.addChild(arrowPath);
      arrowG.addChild(arrowPath2);
      arrowG.addChild(arrowPath3);
      arrowG.addChild(arrowPath4);
      arrowG.addChild(arrowPath5);
      zr.addGroup(arrowG);
      //console.log(arrowG);
      // 给箭头Group加动画
      var animArrow1 = zr.animate(arrowPath.id, "style", true)
        .when(0, {
          opacity : 0,
        })
        .when(1000, {
          opacity : 0.2
        })
        .start();
      var animArrow2 = zr.animate(arrowPath2.id, "style", true)
        .when(0, {
          opacity : 0.2
        })
        .when(1000, {
          opacity : 1
        })
        .start();
      var animArrow4 = zr.animate(arrowPath4.id, "style", true)
        .when(0, {
          opacity : 1
        })
        .when(1000, {
          opacity : 0.2
        })
        .start();
      var animArrow5 = zr.animate(arrowPath5.id, "style", true)
        .when(0, {
          opacity : 0.2
        })
        .when(1000, {
          opacity : 0
        })
        .start();
      var tm1 = zr.animate(arrowG.id, "", true)
        .when(0, {
          position : [pX,pY]
        })
        .when(1000, {
          position : [pX,pY+arrowGapHeight]
        })
        .start();


      // part2 转化text和rect
      var rect = new RectangleShape({
        style : {
          x : pX+15,
          y : pY+20,
          opacity: 0.8,
          width : 45,
          height: 38,
          radius: [5, 5],
          color : '#FFFFFF',
          text : '转化\n'+text,
          textPosition: 'inside',
          textColor: font_fill_text,
          textFont: 'bold 16px verdana'
        },
        hoverable: hoverable_default,
        zlevel: 2
      });
      zr.addElement(rect);

      funnelEls.push(arrowG);
      funnelEls.push(rect);
      //window.ggg.push(arrowG);
      //window.ggg.push(rect);

      // TODO: 暂时不需要另外创建text元素
      //var text1;
      //var text2;
    }

    //window.tms = [];

    // TEST: 测试指标数据
    var channelsData = [
      {
        index: '0',
        appRate: 0.3,
        weiXinRate: 0.45,
        networkRate: 0.25,
        appConversionRate: '50%',
        weiXinConversionRate: '20%',
        networkConversionRate: '40%',
        conversionRate: '88%',
        to10086Rate: '12%'
      },
      {
        index: '1',
        appRate: 0.25,
        weiXinRate: 0.4,
        networkRate: 0.35,
        appConversionRate: '80%',
        weiXinConversionRate: '30%',
        networkConversionRate: '20%',
        conversionRate: '68%',
        to10086Rate: '15%'
      },
      {
        index: '2',
        appRate: 0.35,
        weiXinRate: 0.45,
        networkRate: 0.2,
        appConversionRate: '',
        weiXinConversionRate: '',
        networkConversionRate: '',
        conversionRate: '',
        to10086Rate: ''
      }
    ];

    var funnelEls = []

    // 各层分渠道元素和color集合
    var layer1Paths_arr = [];
    var layer2Paths_arr = [];
    var layer3Paths_arr = [];
    // 分渠道触发动画的元素集合
    var channel1HoverElementSet = [];                      // APP 分渠道
    var channel2HoverElementSet = [];                      // 微信 分渠道
    var channel3HoverElementSet = [];                      // 网络 分渠道
    // 分渠道执行动画的元素集合
    var channel1AnimSet = [];                      // APP 分渠道
    var channel2AnimSet = [];                      // 微信 分渠道
    var channel3AnimSet = [];                      // 网络 分渠道

    // 杯壁内部分渠道elements
    function createChannelArea(indexData, layerPaths_arr, defaultColor, activeColors, opacity, conversionArea_Y){
      //        分渠道图形 path
//        a.path的width、height、中心点，影响转化区域的位置
//        b.path是该层第几个，绘制的方式（第一个、中间、最后一个、第一且是最后一个）
//	      c.分渠道path之间的间隙
//        d.是否创建和显示
//        e.变宽
      var appPath;
      var appPathText;
      var appPathCenterPoint;              // 中心点
      var appArrowG;
      var appRateTextRect;
      var appRateText1;
      var appRateText2;
      var appWidth = 0;
      var appBottomWidth = 0;

      var weiXinPath;
      var weiXinPathText;
      var weiXinPathCenterPoint;              // 中心点
      var weiXinArrowG;
      var weiXinRateTextRect;
      var weiXinRateText1;
      var weiXinRateText2;
      var weiXinWidth = 0;
      var weiXinBottomWidth = 0;

      var networkPath;
      var networkPathText;
      var networkPathCenterPoint;              // 中心点
      var networkArrowG;
      var networkRateTextRect;
      var networkRateText1;
      var networkRateText2;
      var networkWidth = 0;
      var networkBottomWidth = 0;

      var appRate = indexData.appRate;
      var weiXinRate = indexData.weiXinRate;
      var networkRate = indexData.networkRate;
      var appConversionRate = indexData.appConversionRate;
      var weiXinConversionRate = indexData.weiXinConversionRate;
      var networkConversionRate = indexData.networkConversionRate;

      // 如果控制了分渠道的数量，要计算新的总占比和各分渠道占比
      var newTotal = 0;

      // 检查有几个分渠道是否有数据，如果flag为false，不生成改分渠道的element，也不执行动画
      var channelCount = 0;
      if (appRate > 0 && flag_App) {
        channelCount++;
        newTotal += appRate;
      }
      if (weiXinRate > 0 && flag_WeiXin) {
        channelCount++;
        newTotal += weiXinRate;
      }
      if (networkRate > 0 && flag_Network) {
        channelCount++;
        newTotal += networkRate;
      }

      // 到分渠道的数量改变时，分渠道显示的数值（占比）也会改变
      appRate = appRate / newTotal;
      weiXinRate = weiXinRate / newTotal;
      networkRate = networkRate / newTotal;

      // 计算每层杯壁内侧左右两侧的距离，已减去可能出现的间隔
      var layerWidth = borderCoordinate[indexData.index].rightTopX - borderCoordinate[indexData.index].leftTopX
        - channelGapLength * (channelCount - 1);
      var layerBottomWidth = borderCoordinate[indexData.index].rightBottomX - borderCoordinate[indexData.index].leftBottomX
        - channelGapLength * (channelCount - 1);
      // 该层的高度
      var layerHeight = borderCoordinate[indexData.index].rightBottomY - borderCoordinate[indexData.index].rightTopY;
      // 高层Y轴中心点
      var layerCenterY = borderCoordinate[indexData.index].rightTopY + layerHeight / 2;

      // app 图形绘制
      // TODO 如果宽度没有到达杯壁下面的点，怎么处理，
      // TODO 即 图形杯壁方向的bottomX小于杯壁内侧的bottomX（左边，右边是大于）
      // TODO 如果分渠道的宽度小，重新计算text的坐标X，
      if (appRate > 0 && flag_App) {
        appWidth = appRate * layerWidth;     // 分渠道APP图形的上方宽度
        appBottomWidth = appRate * layerBottomWidth;
        // 第一个且最后一个
        if (channelCount === 1) {
          appPath = new PathShape({
            style : {
              path : borderCoordinate[indexData.index].leftPathStr + "l" + appWidth + ",0" + borderCoordinate[indexData.index].rightPathStr.replace("M", "L") + "Z",
              color : defaultColor,
              text: Math.round(appRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
              //textColor:
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
        } else {
          // 不是最后一个，右边不是弧线
          appPath = new PathShape({
            style : {
              path : borderCoordinate[indexData.index].leftPathStr + "l" + appWidth + ",0l0," + layerHeight + "Z",
              color : defaultColor,
              text: Math.round(appRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
        }

        // 获取中心点
        appPathCenterPoint = {
          x: borderCoordinate[indexData.index].leftBottomX + appBottomWidth / 2,
          y: borderCoordinate[indexData.index].rightTopY + layerHeight / 2
        };

        // 分渠道数字和流转部分
        if (appPath) {
          zr.addElement(appPath);
          funnelEls.push(appPath);
          //layerPaths_arr.push(
          //  {
          //    path: appPath,
          //    fill_default: defaultColor,
          //    fill_anim: activeColors[0]
          //  }
          //);
          //channel1HoverElementSet.push(appPath);

          if (appConversionRate) {
            // 箭头组
            createLayerConversionEls(appPathCenterPoint.x, borderCoordinate[indexData.index].leftBottomY, appConversionRate);
          }
        }
      }

      // weixin
      if (weiXinRate > 0 && flag_WeiXin) {
        weiXinWidth = weiXinRate * layerWidth;
        weiXinBottomWidth = weiXinRate * layerBottomWidth;
        // 第一个且最后一个
        if (channelCount === 1) {
          weiXinPath = new PathShape({
            style : {
              path : borderCoordinate[indexData.index].leftPathStr + "l" + weiXinWidth + ",0" + borderCoordinate[indexData.index].rightPathStr.replace("M", "L") + "Z",
              color : defaultColor,
              text: Math.round(weiXinRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
          weiXinPathCenterPoint = {x: borderCoordinate[indexData.index].leftBottomX + weiXinBottomWidth / 2};
        } else if (channelCount === 3) {
          // 中间
          weiXinPath = new PathShape({
            style : {
              path : "M" + (borderCoordinate[indexData.index].leftTopX + appWidth + channelGapLength) + "," + borderCoordinate[indexData.index].leftTopY
              + "l" + weiXinWidth + ",0l0," + layerHeight + "l" + (weiXinWidth * -1) + ",0Z",
              color : defaultColor,
              text: Math.round(weiXinRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
          weiXinPathCenterPoint = {x: borderCoordinate[indexData.index].leftBottomX + appBottomWidth + channelGapLength + weiXinBottomWidth / 2};
        } else {
          // 两个分渠道
          if (appPath) {
            // 最后一个
            var weiXinX = borderCoordinate[indexData.index].leftTopX + appWidth + (channelCount - 1) * 5;
            weiXinPath = new PathShape({
              style : {
                path : borderCoordinate[indexData.index].rightPathStr +
                "L" + weiXinX +
                "," + borderCoordinate[indexData.index].leftBottomY +
                "l0," + (layerHeight * -1) + "Z",
                color : defaultColor,
                text: Math.round(weiXinRate * 100) + '%',
                textFont: 'bold 16px verdana',
                textPosition: 'inside'
              },
              hoverable: hoverable_default,
              zlevel: 1
            });
            weiXinPathCenterPoint = {x: borderCoordinate[indexData.index].rightBottomX - weiXinBottomWidth / 2};
          } else {
            // 第一个
            weiXinPath = new PathShape({
              style : {
                path : borderCoordinate[indexData.index].leftPathStr + "l" + weiXinWidth + ",0l0," + layerHeight + "Z",
                color : defaultColor,
                text: Math.round(weiXinRate * 100) + '%',
                textFont: 'bold 16px verdana',
                textPosition: 'inside'
              },
              hoverable: hoverable_default,
              zlevel: 1
            });
            weiXinPathCenterPoint = {x: borderCoordinate[indexData.index].leftBottomX + weiXinBottomWidth / 2};
          }
        }

        // 分渠道数字和流转部分
        if (weiXinPath) {
          zr.addElement(weiXinPath);
          funnelEls.push(weiXinPath);

          if (weiXinConversionRate) {
            // 箭头组
            createLayerConversionEls(weiXinPathCenterPoint.x, borderCoordinate[indexData.index].leftBottomY, weiXinConversionRate);
          }
        }
      }

      // network
      if (networkRate > 0 && flag_Network) {
        networkWidth = networkRate * layerWidth;
        networkBottomWidth = networkRate * layerBottomWidth;
        // 第一个且最后一个
        if (channelCount === 1) {
          networkPath = new PathShape({
            style : {
              path : borderCoordinate[indexData.index].leftPathStr + "l" + networkWidth + ",0" + borderCoordinate[indexData.index].rightPathStr.replace("M", "L") + "Z",
              color : defaultColor,
              text: Math.round(networkRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
          networkPathCenterPoint = {x: borderCoordinate[indexData.index].rightTopX + networkWidth / 2};
        } else {
          // 最后一个
          var xxx1 = borderCoordinate[indexData.index].leftTopX + appWidth + weiXinWidth + (channelCount - 1) * 5;
          networkPath = new PathShape({
            style : {
              path : borderCoordinate[indexData.index].rightPathStr +
              "L" + xxx1 +
              "," + borderCoordinate[indexData.index].leftBottomY +
              "l0," + (layerHeight * -1) + "Z",
              color : defaultColor,
              text: Math.round(networkRate * 100) + '%',
              textFont: 'bold 16px verdana',
              textPosition: 'inside'
            },
            hoverable: hoverable_default,
            zlevel: 1
          });
          networkPathCenterPoint = {x: borderCoordinate[indexData.index].rightTopX - networkWidth / 2};
        }

        // 分渠道数字和流转部分
        if (networkPath) {
          zr.addElement(networkPath);
          funnelEls.push(networkPath);

          if (weiXinConversionRate) {
            // 箭头组
            createLayerConversionEls(networkPathCenterPoint.x, borderCoordinate[indexData.index].leftBottomY, networkConversionRate);
          }

        }
      }
    }

// 漏斗图三层图形的创建
    function createFunnel(){
      // 停止动画和隐藏元素

      // 清空杯壁内的元素
      Util.each(funnelEls, function(el, i){
        zr.delElement(el);
      });

      layer1Paths_arr.length = 0;   // 清空数组
      layer2Paths_arr.length = 0;
      layer3Paths_arr.length = 0;

      createChannelArea(channelsData[0], layer1Paths_arr, colorL1Default, colorsL1Active, opacity_default, 90);
      createChannelArea(channelsData[1], layer2Paths_arr, colorL2Default, colorsL2Active, opacity_default, 230);
      createChannelArea(channelsData[2], layer3Paths_arr, colorL3Default, colorsL3Active, opacity_default);
    }

    createFunnel();

    /**
     * 创建按钮元素
     */
    function createIcons(){
      var icon_app = new PathShape({
        style : {
          path : 'M88.419,7.73H71.581c-0.478,0-0.864,0.387-0.864,0.864v32.812c0,0.476,0.387,0.864,0.864,0.864h16.838          c0.478,0,0.864-0.388,0.864-0.864V8.594C89.283,8.117,88.896,7.73,88.419,7.73z M80,39.68c-0.834,0-1.512-0.678-1.512-1.512          c0-0.834,0.678-1.511,1.512-1.511s1.512,0.677,1.512,1.511C81.512,39.002,80.834,39.68,80,39.68z M87.125,34.498H72.876V10.32h14.248V34.498z',
          color : '#56ABE4',
        },
        clickable : true,
        onclick: function(params){
          console.log(1);
          flag_App = !flag_App;
          if (flag_App) {
            icon_app.style.color = '#56abe4';
          } else {
            icon_app.style.color = '#999999';
          }
          zr.modElement(icon_app);
          createFunnel();
          zr.refresh();
          return false;
        }
      });

      var icon_weixin = new PathShape({
        style : {
          path : 'M207.094,18.553c0.46,0,0.915,0.033,1.366,0.084c-1.228-5.718-7.339-9.964-14.315-9.964 c-7.799,0-14.188,5.315-14.188,12.066c0,3.896,2.125,7.097,5.677,9.579l-1.419,4.268l4.96-2.487c1.774,0.351,3.199,0.712,4.97,0.712 c0.445,0,0.887-0.022,1.324-0.057c-0.277-0.948-0.438-1.941-0.438-2.973C195.032,23.582,200.354,18.553,207.094,18.553z M199.465,14.705c1.068,0,1.776,0.704,1.776,1.771c0,1.063-0.708,1.776-1.776,1.776c-1.063,0-2.13-0.713-2.13-1.776 C197.335,15.409,198.402,14.705,199.465,14.705z M189.536,18.252c-1.063,0-2.136-0.713-2.136-1.776c0-1.066,1.073-1.771,2.136-1.771 s1.771,0.704,1.771,1.771C191.307,17.539,190.599,18.252,189.536,18.252z M220.043,29.611c0-5.674-5.676-10.297-12.051-10.297 c-6.751,0-12.068,4.623-12.068,10.297c0,5.682,5.317,10.296,12.068,10.296c1.412,0,2.838-0.356,4.257-0.712l3.892,2.132 l-1.067-3.547C217.921,35.644,220.043,32.811,220.043,29.611z M204.079,27.836c-0.706,0-1.419-0.703-1.419-1.421 c0-0.706,0.713-1.417,1.419-1.417c1.073,0,1.776,0.711,1.776,1.417C205.855,27.133,205.152,27.836,204.079,27.836z M211.884,27.836 c-0.702,0-1.409-0.703-1.409-1.421c0-0.706,0.707-1.417,1.409-1.417c1.063,0,1.775,0.711,1.775,1.417 C213.659,27.133,212.946,27.836,211.884,27.836z',
          color : '#11CD6E'
        },
        clickable : true,
        onclick: function(params){
          flag_WeiXin = !flag_WeiXin;
          if (flag_WeiXin) {
            icon_weixin.style.color = '#11cd6e';
          } else {
            icon_weixin.style.color = '#999999';
          }
          zr.modElement(icon_weixin);
          createFunnel();
          zr.refresh();
          return false;
        }
      });

      var icon_network = new PathShape({
        style : {
          path : 'M310,7.227c-9.816,0-17.773,7.958-17.773,17.773c0,9.814,7.957,17.773,17.773,17.773 S327.773,34.814,327.773,25C327.773,15.185,319.816,7.227,310,7.227z M299.107,14.108c1.248-1.247,2.675-2.256,4.247-3.01 c-1.145,1.523-2.099,3.432-2.789,5.607h-3.55C297.612,15.772,298.312,14.903,299.107,14.108z M295.776,19.075h4.166 c-0.317,1.497-0.519,3.089-0.583,4.74h-4.718C294.764,22.178,295.146,20.59,295.776,19.075z M294.642,26.185h4.718 c0.066,1.651,0.266,3.242,0.583,4.74h-4.166C295.144,29.41,294.764,27.822,294.642,26.185z M299.107,35.891 c-0.796-0.794-1.495-1.664-2.092-2.597h3.55c0.69,2.176,1.643,4.082,2.789,5.607C301.778,38.147,300.353,37.139,299.107,35.891z M308.815,40.23c-0.541-0.155-1.076-0.422-1.6-0.792c-0.983-0.694-1.927-1.764-2.724-3.09c-0.552-0.918-1.027-1.941-1.426-3.055 h5.749V40.23z M308.815,30.925h-6.444c-0.357-1.518-0.57-3.104-0.639-4.74h7.083V30.925z M308.815,23.815h-7.083 c0.068-1.636,0.283-3.223,0.639-4.74h6.444V23.815L308.815,23.815z M308.815,16.706h-5.749c0.398-1.114,0.874-2.135,1.426-3.055 c0.797-1.33,1.74-2.397,2.724-3.09c0.525-0.37,1.059-0.635,1.6-0.792V16.706L308.815,16.706z M325.358,23.815h-4.718 c-0.066-1.651-0.266-3.243-0.583-4.74h4.166C324.856,20.59,325.236,22.178,325.358,23.815z M320.893,14.108 c0.796,0.795,1.495,1.664,2.092,2.598h-3.55c-0.69-2.176-1.643-4.084-2.789-5.607C318.222,11.853,319.647,12.861,320.893,14.108z M311.185,9.77c0.541,0.157,1.076,0.422,1.6,0.792c0.983,0.694,1.927,1.763,2.724,3.09c0.552,0.92,1.027,1.94,1.426,3.055h-5.749 V9.77z M311.185,19.075h6.444c0.355,1.518,0.57,3.104,0.639,4.74h-7.083V19.075z M311.185,26.185h7.083 c-0.068,1.636-0.283,3.223-0.639,4.74h-6.444V26.185z M312.786,39.438c-0.525,0.37-1.059,0.637-1.599,0.792l-0.003-6.937h5.749 c-0.398,1.113-0.874,2.137-1.423,3.055C314.713,37.678,313.77,38.746,312.786,39.438z M320.893,35.891 c-1.248,1.248-2.675,2.257-4.247,3.011c1.145-1.525,2.099-3.432,2.789-5.607h3.55C322.388,34.227,321.688,35.097,320.893,35.891z M324.224,30.925h-4.166c0.317-1.498,0.519-3.089,0.583-4.74h4.718C325.236,27.822,324.854,29.41,324.224,30.925z',
          color : '#EA8010'
        },
        clickable : true,
        onclick: function(params){
          flag_Network = !flag_Network;
          if (flag_Network) {
            icon_network.style.color = '#ea8010';
          } else {
            icon_network.style.color = '#999999';
          }
          zr.modElement(icon_network);
          createFunnel();
          zr.refresh();
          return false;
        }
      });

      zr.addElement(icon_app);
      zr.addElement(icon_weixin);
      zr.addElement(icon_network);
    }

    createIcons();


    var arrow_totalConversion1;
    var text_totalConversion1;
    var text_totalConversion2;

    var arrow_totalConversion2;
    var text_totalConversion3;
    var text_totalConversion4;

    /**
     * 创建层次总体转化元素
     */
    function createLayerTotalConversionEls(){
      // 箭头
      arrow_totalConversion1 = new PathShape({
        style: {
          path: 'M387.613,137.498c-4.61,11.659-15.718,18.868-27.556,19.104l-1.027,6.002l-8.769-12.395 l12.391-8.771l-0.964,5.632c7.5-0.81,14.311-5.668,17.22-13.176c0-0.003,0.003-0.009,0.005-0.017 c4.136-10.701-1.198-22.771-11.898-26.919c-0.046-0.017-0.092-0.028-0.139-0.044l5.337-3.782l-4.059-5.735 c0.759,0.228,1.515,0.481,2.266,0.773c15.552,6.027,23.3,23.581,17.275,39.129C387.668,137.366,387.64,137.432,387.613,137.498z',
          color: '#8CD1FA'
          //color: arrowColor
        },
        hoverable: hoverable_default
      });

      text_totalConversion1 = new TextShape({
        style : {
          x : 390,
          y : 120,
          brushType : 'fill',
          color : font_fill_text,
          text : '转化',
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      text_totalConversion2 = new TextShape({
        style : {
          x : 390,
          y : 140,
          brushType : 'fill',
          color : font_fill_value,
          text : channelsData[0].conversionRate,
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      arrow_totalConversion2 = new PathShape({
        style: {
          path: 'M362.613,282.498c-4.61,11.659-15.718,18.868-27.556,19.104l-1.027,6.002l-8.769-12.395 l12.391-8.771l-0.964,5.632c7.5-0.81,14.311-5.668,17.22-13.176c0-0.003,0.003-0.009,0.005-0.017 c4.136-10.701-1.198-22.771-11.898-26.919c-0.046-0.017-0.092-0.028-0.139-0.044l5.337-3.782l-4.059-5.735 c0.759,0.228,1.515,0.481,2.266,0.773c15.552,6.027,23.3,23.581,17.275,39.129C362.668,282.366,362.64,282.432,362.613,282.498z',
          color: '#8CD1FA'
          //color: arrowColor
        },
        hoverable: hoverable_default
      });

      text_totalConversion3 = new TextShape({
        style : {
          x : 365,
          y : 265,
          brushType : 'fill',
          color : font_fill_text,
          text : '转化',
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      text_totalConversion4 = new TextShape({
        style : {
          x : 365,
          y : 285,
          brushType : 'fill',
          color : font_fill_value,
          text : channelsData[1].conversionRate,
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      zr.addElement(arrow_totalConversion1);
      zr.addElement(text_totalConversion1);
      zr.addElement(text_totalConversion2);
      zr.addElement(arrow_totalConversion2);
      zr.addElement(text_totalConversion3);
      zr.addElement(text_totalConversion4);
    }

    createLayerTotalConversionEls();

    var robotTo10086_path1;
    var robotTo10086_path2;
    var robotTo10086_Title;
    var robotTo10086_value;
    var robotTo10086_icon;

    var onlineTo10086_path1;
    var onlineTo10086_path2;
    var onlineTo10086_Title;
    var onlineTo10086_value;
    var onlineTo10086_icon;

    /**
     * 创建转10086占比区域的元素
     */
    function create10086Els(){
      robotTo10086_path1 = new PolylineShape({
        style : {
          pointList : [[335, 230], [375, 230]],
          strokeColor : font_fill_value,
          lineWidth : 2,
          opacity: opacity_default,
          lineType : 'dotted'
        },
        hoverable: hoverable_default
      });

      robotTo10086_path2 = new PolylineShape({
        style : {
          pointList : [[375, 230], [415, 230], [415, 222]],
          strokeColor : font_fill_text,
          lineWidth : 2,
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      robotTo10086_Title = new TextShape({
        style : {
          x : 350,
          y : 220,
          brushType : 'fill',
          color : font_fill_text,
          text : '转10086客户占比',
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      robotTo10086_value = new TextShape({
        style : {
          x : 415,
          y : 200,
          brushType : 'fill',
          color : font_fill_value,
          text : channelsData[0].to10086Rate,
          textFont : 'bold 22px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      robotTo10086_icon = new PathShape({
        position: [390, 180],
        style: {
          path: 'M4.043,7.081c-1.715,0-3.045-0.132-3.427-0.174c-0.879-0.1-1.511-0.89-1.413-1.767 c0.098-0.875,0.875-1.507,1.767-1.414c3.982,0.437,10.085,0.059,11.151-2.16c0.381-0.795,1.335-1.135,2.135-0.75 c0.797,0.382,1.133,1.337,0.751,2.134C13.32,6.457,7.768,7.081,4.043,7.081z M18.4,5.491c-0.885,0-1.601-0.715-1.601-1.601v-5.513 l-2.138-0.762C14.025-2.611,13.6-3.215,13.6-3.892c0-7.938-6.459-14.4-14.399-14.4c-7.939,0-14.4,6.461-14.4,14.4 c0,0.517-0.249,1.002-0.67,1.303L-16.8-1.927v5.817c0,0.886-0.717,1.601-1.6,1.601S-20,4.776-20,3.891V-2.75 c0-0.518,0.25-1.002,0.67-1.303l0.949-0.676c0.44-9.318,8.157-16.763,17.581-16.763c9.321,0,16.973,7.283,17.564,16.459l2.173,0.774 C19.574-4.03,20-3.428,20-2.75v6.641C20,4.776,19.285,5.491,18.4,5.491z M5.6,12.682v-0.485c1.402-1.094,2.519-2.146,3.185-3.64 c-1.458,0.23-3.08,0.148-4.386,0.148c-1.6,0-2.967,0.044-3.799-0.049C-1.157,8.462-2.423,6.72-2.228,4.963 c0.195-1.758,1.792-3.032,3.533-2.827c3.563,0.383,7.489-0.033,9.063-0.7c0.067-1.461,0.049-3.002,0.049-4.173 c0-6.847-4.164-10.909-10.837-11.057c-0.039-0.003-0.941-0.003-0.977-0.003C-8.07-13.659-12.072-9.551-12.072-2.693 c0,4.234,0.072,11.142,4.872,14.89v0.485c-6.399,1.002-11.297,3.625-11.297,7.101c0,0.884,0.741,1.709,1.625,1.709h31.4 c0.885,0,1.996-0.825,1.996-1.709C16.524,16.307,12,13.684,5.6,12.682z',
          color: '#56ABE4'
        },
        hoverable: hoverable_default
      });

      onlineTo10086_path1 = new PolylineShape({
        style : {
          pointList : [[315, 380], [375, 380]],
          strokeColor : font_fill_value,
          lineWidth : 2,
          opacity: opacity_default,
          lineType : 'dotted'
        },
        hoverable: hoverable_default
      });

      onlineTo10086_path2 = new PolylineShape({
        style : {
          pointList : [[375, 380], [415, 380], [415, 372]],
          strokeColor : font_fill_text,
          lineWidth : 2,
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      onlineTo10086_Title = new TextShape({
        style : {
          x : 350,
          y : 370,
          brushType : 'fill',
          color : font_fill_text,
          text : '转10086客户占比',
          textFont : 'bold 16px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      onlineTo10086_value = new TextShape({
        style : {
          x : 415,
          y : 350,
          brushType : 'fill',
          color : font_fill_value,
          text : channelsData[1].to10086Rate,
          textFont : 'bold 22px verdana',
          textAlign : 'left',
          textBaseline : 'inside',
          opacity: opacity_default
        },
        hoverable: hoverable_default
      });

      onlineTo10086_icon = new PathShape({
        position: [390, 330],
        style: {
          path: 'M4.043,7.081c-1.715,0-3.045-0.132-3.427-0.174c-0.879-0.1-1.511-0.89-1.413-1.767 c0.098-0.875,0.875-1.507,1.767-1.414c3.982,0.437,10.085,0.059,11.151-2.16c0.381-0.795,1.335-1.135,2.135-0.75 c0.797,0.382,1.133,1.337,0.751,2.134C13.32,6.457,7.768,7.081,4.043,7.081z M18.4,5.491c-0.885,0-1.601-0.715-1.601-1.601v-5.513 l-2.138-0.762C14.025-2.611,13.6-3.215,13.6-3.892c0-7.938-6.459-14.4-14.399-14.4c-7.939,0-14.4,6.461-14.4,14.4 c0,0.517-0.249,1.002-0.67,1.303L-16.8-1.927v5.817c0,0.886-0.717,1.601-1.6,1.601S-20,4.776-20,3.891V-2.75 c0-0.518,0.25-1.002,0.67-1.303l0.949-0.676c0.44-9.318,8.157-16.763,17.581-16.763c9.321,0,16.973,7.283,17.564,16.459l2.173,0.774 C19.574-4.03,20-3.428,20-2.75v6.641C20,4.776,19.285,5.491,18.4,5.491z M5.6,12.682v-0.485c1.402-1.094,2.519-2.146,3.185-3.64 c-1.458,0.23-3.08,0.148-4.386,0.148c-1.6,0-2.967,0.044-3.799-0.049C-1.157,8.462-2.423,6.72-2.228,4.963 c0.195-1.758,1.792-3.032,3.533-2.827c3.563,0.383,7.489-0.033,9.063-0.7c0.067-1.461,0.049-3.002,0.049-4.173 c0-6.847-4.164-10.909-10.837-11.057c-0.039-0.003-0.941-0.003-0.977-0.003C-8.07-13.659-12.072-9.551-12.072-2.693 c0,4.234,0.072,11.142,4.872,14.89v0.485c-6.399,1.002-11.297,3.625-11.297,7.101c0,0.884,0.741,1.709,1.625,1.709h31.4 c0.885,0,1.996-0.825,1.996-1.709C16.524,16.307,12,13.684,5.6,12.682z',
          color: '#56ABE4'
        },
        hoverable: hoverable_default
      });

      zr.addElement(robotTo10086_path1);
      zr.addElement(robotTo10086_path2);
      zr.addElement(robotTo10086_Title);
      zr.addElement(robotTo10086_value);
      zr.addElement(robotTo10086_icon);

      zr.addElement(onlineTo10086_path1);
      zr.addElement(onlineTo10086_path2);
      zr.addElement(onlineTo10086_Title);
      zr.addElement(onlineTo10086_value);
      zr.addElement(onlineTo10086_icon);
    }

    create10086Els();

    // 杯壁

    zr.addElement(pathLeftBorder1);
    zr.addElement(pathRightBorder1);
    zr.addElement(pathLeftBorder2);
    zr.addElement(pathRightBorder2);
    zr.addElement(pathLeftBorder3);
    zr.addElement(pathRightBorder3);

    window.zr = zr;

    // zrender 绘制
    //zr.render();
});
