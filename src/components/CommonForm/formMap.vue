<template>
  <div class="org-form-map">
    <div :id="propName + '_map'" :style="{height: height}" />
  </div>
</template>

<script>
import { loadModules } from 'esri-loader'
export default {
  props: {
    lnglat: {
      type: Array,
      default: () => {
        return []
      }
    },
    propName: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: null,
      mapview: null,
      graphic: null,
      pointGraphic: null
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      const options = {
        url: 'https://js.arcgis.com/4.15/',
        css: 'https://js.arcgis.com/4.15/esri/themes/light/main.css'
      }
      //  "esri/views/SceneView" 3d  2d是MapView
      loadModules(
        [
          'esri/Map',
          'esri/views/MapView',
          // "esri/layers/TileLayer", //地图图层可以使用这个类来添加
          // "esri/layers/FeatureLayer",//自定义的图层
          'esri/Graphic', // 图像，点线面等
          // "esri/widgets/Fullscreen", //全屏小部件
          // "esri/widgets/Zoom", //放大缩小部件
          'dojo/domReady!'
        ],
        options
      ).then(([Map, MapView, Graphic]) => {
        this.graphic = Graphic
        this.map = new Map({
          basemap: 'topo-vector'
          // ground: "world-elevation",
        })
        this.mapview = new MapView({
          container: this.propName + '_map', // Reference to the DOM node that will contain the view
          map: this.map, // References the map object created in step 3
          zoom: 10,
          center: this.lnglat.length > 0 ? this.lnglat : [118.783351, 32.047192]
        })
        this.mapview.on('click', this.clickMap)
        // //在右上角添加全屏组件
        // mapview.ui.add(
        //   new Fullscreen({
        //     view: mapview,
        //   }),
        //   "top-right"
        // );
        // mapview.ui.add(new Zoom({ view: mapview }), "top-right"); //在右上角添加缩放组件
        if (this.lnglat.length > 0) {
          this.drawPoint(this.lnglat[0], this.lnglat[1])
        }
      })
    },
    drawPoint(x, y) {
      const point = {
        type: 'point', // autocasts as new Polyline()
        x: x,
        y: y
      }
      // 添加图片修饰点
      const lineSymbol = {
        type: 'simple-marker', // autocasts as new PictureMarkerSymbol()
        // url: this.markpic,
        color: 'red'
        //   width: "64px",
        //   height: "64px"
      }
      // eslint-disable-next-line new-cap
      this.pointGraphic = new this.graphic({
        geometry: point,
        symbol: lineSymbol
        // attributes: lineAtt,
        // popupTemplate: template,
      })
      // 将绘制的点加入地图图层
      this.mapview.graphics.addMany([this.pointGraphic])
    },
    clickMap(e) {
      this.mapview.graphics.remove(this.pointGraphic)
      this.drawPoint(e.mapPoint.longitude, e.mapPoint.latitude)
      this.$emit('getPoint', { lnglat: [e.mapPoint.longitude, e.mapPoint.latitude], prop: this.propName })
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '@/styles/index.scss';

</style>
