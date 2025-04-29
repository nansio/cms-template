<template>
  <div class="org-form-map">
    <div :id="propName + '_map'" :style="{height: height}" />
  </div>
</template>

<script>
/* eslint-disable */
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
          'esri/widgets/Search',
          'esri/layers/support/TileInfo',
          'esri/layers/WebTileLayer',
          'dojo/domReady!'
        ],
        options
      ).then(([Map, MapView, Graphic, Search, TileInfo, WebTileLayer]) => {
        const tileInfo = new TileInfo({
          dpi: 90.71428571427429,
          size: 256,
          origin: {
            x: -180,
            y: 90
          },
          spatialReference: {
            wkid: 4326
          },
          lods: [
            { level: 2, levelValue: 2, resolution: 0.3515625, scale: 147748796.52937502 },
            { level: 3, levelValue: 3, resolution: 0.17578125, scale: 73874398.264687508 },
            { level: 4, levelValue: 4, resolution: 0.087890625, scale: 36937199.132343754 },
            { level: 5, levelValue: 5, resolution: 0.0439453125, scale: 18468599.566171877 },
            { level: 6, levelValue: 6, resolution: 0.02197265625, scale: 9234299.7830859385 },
            { level: 7, levelValue: 7, resolution: 0.010986328125, scale: 4617149.8915429693 },
            { level: 8, levelValue: 8, resolution: 0.0054931640625, scale: 2308574.9457714846 },
            { level: 9, levelValue: 9, resolution: 0.00274658203125, scale: 1154287.4728857423 },
            { level: 10, levelValue: 10, resolution: 0.001373291015625, scale: 577143.73644287116 },
            { level: 11, levelValue: 11, resolution: 0.0006866455078125, scale: 288571.86822143558 },
            { level: 12, levelValue: 12, resolution: 0.00034332275390625, scale: 144285.93411071779 },
            { level: 13, levelValue: 13, resolution: 0.000171661376953125, scale: 72142.967055358895 },
            { level: 14, levelValue: 14, resolution: 8.58306884765625e-005, scale: 36071.483527679447 },
            { level: 15, levelValue: 15, resolution: 4.291534423828125e-005, scale: 18035.741763839724 },
            { level: 16, levelValue: 16, resolution: 2.1457672119140625e-005, scale: 9017.8708819198619 },
            { level: 17, levelValue: 17, resolution: 1.0728836059570313e-005, scale: 4508.9354409599309 },
            { level: 18, levelValue: 18, resolution: 5.3644180297851563e-006, scale: 2254.4677204799655 },
            //{ level: 19, levelValue: 19, resolution: 2.68220901489257815e-006, scale: 1127.23386023998275 },
            //{ level: 20, levelValue: 2, resolution: 1.341104507446289075e-006, scale: 563.616930119991375 }
          ]
        });
        // 天地图影像底图
        const tiledLayer = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.gov.cn/DataServer?T=img_c&x={col}&y={row}&l={level}&tk=036825be613a859007fa3004c9e87ddf',
          // urlTemplate: 'https://{subDomain}.tianditu.gov.cn/DataServer?T=vec_c&x={col}&y={row}&l={level}&tk=036825be613a859007fa3004c9e87ddf',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tileInfo: tileInfo,
          spatialReference: {
            wkid: 4326
          }
        })
        // 天地图影像底图-标注
        const tiledLayer_wz = new WebTileLayer({
          urlTemplate: 'https://{subDomain}.tianditu.gov.cn/DataServer?T=cia_c&x={col}&y={row}&l={level}&tk=036825be613a859007fa3004c9e87ddf',
          // urlTemplate: 'https://{subDomain}.tianditu.gov.cn/DataServer?T=cva_c&x={col}&y={row}&l={level}&tk=036825be613a859007fa3004c9e87ddf',
          subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
          tileInfo: tileInfo,
          spatialReference: {
            wkid: 4326
          }
        })
        this.graphic = Graphic
        this.map = new Map({
          // basemap: 'topo-vector'
          // basemap: 'osm'
          // ground: "world-elevation",
          layers: [tiledLayer, tiledLayer_wz]
        })
        this.mapview = new MapView({
          isAttributionTextVisible: false,
          container: this.propName + '_map', // Reference to the DOM node that will contain the view
          map: this.map, // References the map object created in step 3
          zoom: 10,
          center: this.lnglat.length > 0 ? this.lnglat : [118.783351, 32.047192]
        })
        const searchWidget = new Search({
          view: this.mapview,
          popupEnabled: false
        })
        this.mapview.ui.add(
          searchWidget,
          "top-right"
        )
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
