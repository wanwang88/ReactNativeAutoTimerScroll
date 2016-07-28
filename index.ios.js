/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
    AlertIOS
} from 'react-native';

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');

//引入计时器类库
var TimerMixin = require('react-timer-mixin');

//引入json数据
var ImageData = require('./ImageData.json');

var BScrollViewDemo = React.createClass({
    //注册定时器
    mixins: [TimerMixin],

    //设置固定值
    getDefaultProps(){
      return{
        //每隔1秒刷新一次
        duration:1000
      }
    },

    //设置可变的和初始值
    getInitialState(){
      return {
        currentPage:0
      }
    },

    render(){
      return(
        <View style={styles.container}>
          <ScrollView
              ref='scrollView'
              horizontal={true}
              showsHorizontalScrollIndicator = {false}
              pagingEnabled = {true}
              onMomentumScrollEnd = {(e)=>this.onAnimationEnd(e)}
              // 开始拖拽
              onScrollBeginDrag={this.onScrollBeginDrag}
              // 停止拖拽
              onScrollEndDrag={this.onScrollEndDrag}
              >
            {this.renderAllImage()}
          </ScrollView>

          {/*返回指示器*/}
          <View style={styles.pageViewStyle}>
            {/*返回5个圆点*/}
            {this.renderPageCircle()}
          </View>
        </View>
      )
    },

    //开始拖拽
    onScrollBeginDrag(){
      this.clearInterval(this.timer);
    },
    //停止拖拽
     onScrollEndDrag(){
      // 开启定时器
      this.startTimer();
    },

    //实现复杂的操作
    componentDidMount(){
        // 开启定时器
        this.startTimer();
    },

    startTimer(){
        var scrollView = this.refs.scrollView;
        var imgCount = ImageData.data.length;


        //添加定时器

        this.timer = this.setInterval(function(){
          var activePage = 0;
          if((this.state.currentPage+1) >= imgCount){
            activePage = 0;
            //AlertIOS.alert(" b=  " +this.state.currentPage);
          }else{
            activePage = this.state.currentPage+1;
          }

          //更新圆点状态
          this.setState({
            currentPage:activePage
          });
          //scrollView 滚动
          var scrollOffsetX = activePage * width;
          scrollView.scrollResponderScrollTo({x:scrollOffsetX,y:0,animated:false});
        },this.props.duration);
    },


    // 返回所有的图片
    renderAllImage(){
      var allImage = [];
      var imgsArr = ImageData.data;
      for(var i=0 ; i<imgsArr.length;i++){
        var item = imgsArr[i];
        //创建组件加入数组
        allImage.push(
          <Image key={i} source={{uri:item.img}} style={{width:width,height:120}}/>
        );
      }
      return allImage;
    },

    //返回所有的原点
    renderPageCircle(){
      var indicatorArr = [];
      var imgsArr = ImageData.data;
      var style;
      for(var i=0 ; i<imgsArr.length;i++){
        //判断当前页选择样式
        style = (i==this.state.currentPage) ? {color:'orange'}:{color:'#ffffff'};
        indicatorArr.push(
            <Text key={i} style={[{fontSize:25,color:'white'},style]}>&bull;</Text>
        );
      }
      return indicatorArr;
    },

    //一帧滚动结束调用
    onAnimationEnd(e){
      // 计算水平方向的偏移量
      var offSetX = e.nativeEvent.contentOffset.x;

      //当前的页数
      var currentPage= Math.floor(offSetX/width);
      //更新指示器，绘制ui
      this.setState({
          currentPage:currentPage
      });
      //AlertIOS.alert(" currentPage=  " +this.state.currentPage);
    }
});


const styles = StyleSheet.create({
  container: {
    marginTop:25
  },
  pageViewStyle:{
    width:width,
    height:25,
    backgroundColor:'rgba(0,0,0,0.4)',
    position:'absolute',
    bottom:0,
    //设置主轴的方向
    flexDirection:'row',
    //侧轴方向对齐
    alignItems:'center'

  }

});

AppRegistry.registerComponent('BScrollViewDemo', () => BScrollViewDemo);
