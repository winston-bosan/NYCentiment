import React, { Component } from 'react';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default class overlay extends Component {
  static get defaultViewport() {
    return {
      latitude: 40.7128,
      longitude: -74.0,
      zoom: 10,
      maxZoom: 16,
      pitch: 15,
      bearing: 0
    };
  }

  render() {
    const { viewport, data, colorScale, news } = this.props;

    if (!data || news.length === 0) {
      return null;
    }

    let max = 0,
      min = 0;

    news.forEach(el => {
      el.averageScore =
        el.articles.reduce((a, b) => {
          if (max < b.sentiment.score) {
            max = b.sentiment.score;
          } else if (min > b.sentiment.score) {
            min = b.sentiment.score;
          }
          return a + b.sentiment.score;
        }, 0) / el.articles.length;
    });

    //sorted news
    news.sort((a, b) => {
      return b.averageScore - a.averageScore;
    });
    news.forEach((el, index) => {
      el.ranking = index + 1;
      return el;
    });

    //Back to id sorted
    news.sort((a, b) => {
      return a.hoodId - b.hoodId;
    });

    //Merge sorted news with sentiment score with geojson data
    let newData = data;
    newData.features.forEach(el => {
      // console.log(news[el.properties.cartodb_id - 1])
      el.properties.articles = news[el.properties.cartodb_id - 1].articles;
      el.properties.averageScore =
        news[el.properties.cartodb_id - 1].averageScore;
      el.properties.ranking = news[el.properties.cartodb_id - 1].ranking;
    });

    const layer = new GeoJsonLayer({
      id: 'geojson',
      data,
      opacity: 0.8,
      stroked: true,
      filled: true,
      fp64: true,
      getFillColor: f => {
        return colorScale(1, f.properties.ranking, 310);
      },
      lineWidthMinPixels: 1,
      getLineColor: f => [0, 0, 0],
      onClick: info => {
        return this.props.tooltipToParent(info);
      },
      pickable: this.props.onHover || this.props.tooltipToParent
      //   onHover: this.props.onHover
    });

    return <DeckGL {...viewport} layers={[layer]} />;
  }
}
