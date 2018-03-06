/* global window,document */
import React, { Component } from 'react';
import MapGL, { Popup } from 'react-map-gl';
import DeckGLOverlay from '../overlay';
import dummy from './dummy.json';
import nameToId from './nameToId.json';
import storedSentiment from './storedSentiment.json';
import { colorScale } from './colorScale/colorScale';
import { connect } from 'react-redux';
import { hoodNewsMain, hoodNewsSuccess } from '../../modules/counter';
import Article from '../../components/articles/article/article';

// Set your mapbox token here
const MAPBOX_TOKEN =
  'pk.eyJ1IjoiY3N1bm9zZXIiLCJhIjoiY2phN2hoYTIwMjZoejJxbGZxdTgzNDN1dCJ9.jGjeuWPZmEF4AAD4eoRRig'; // eslint-disable-line

// Source data GeoJSON

// const colorScale = (length, ranking) => {
//   console.log((length - ranking) / length);
//   return [0, 0, 255 * Math.pow((length - ranking) / length, 2), 80];
// };

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: dummy,
      coordinates: [-74.006, 40.7128],
      info: { articles: [] },
      tooltipOn: false,
      passiveColor: 'rgba(0,0,0,0)',
      activeColor: 'rgba(100,0,0,0.8)'
    };
  }

  tooltipCallback = (info, news) => {
    if (info) {
      this.setState({
        coordinates: info.lngLat,
        info: info.object.properties,
        tooltipOn: true
      });
    }
  };

  componentWillMount() {
    //test the new york data
    let newBound = dummy;
    this.setState({ data: newBound });
    // console.log(
    //   dummy.features.map(el => {
    //     return {
    //       id: el.properties.cartodb_id,
    //       name: el.properties.neighborhood,
    //       borough: el.properties.borough
    //     };
    //   })
    // );
    // this.props.beginSearchForAll(nameToId);
    this.props.manuallyAddNews(storedSentiment);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  render() {
    const { viewport, data, tooltipOn, info } = this.state;

    let sortedArticles = info.articles.sort((a, b) => {
      return b.sentiment.score - a.sentiment.score;
    });

    return (
      <MapGL
        {...viewport}
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        {tooltipOn && (
          <Popup
            longitude={this.state.coordinates[0]}
            latitude={this.state.coordinates[1]}
            tipSize={20}
            closeOnClick={false}
            captureScroll
            anchor="right"
            onClose={() => {
              this.setState({ tooltipOn: false });
            }}>
            <h1>{info.neighborhood}</h1>
            <p>Average Sentiment Score: {info.averageScore}</p>
            {sortedArticles.map((el, index) => {
              console.log(el);
              return (
                <Article
                  title={el.title}
                  description={el.description}
                  index={index}
                  activeColor={colorScale(
                    sortedArticles[0].sentiment.score,
                    el.sentiment.score,
                    sortedArticles[sortedArticles.length - 1].sentiment.score
                  )}
                  link={el.url}
                />
              );
            })}
          </Popup>
        )}
        <div className="options-panel">
          <h1>NYC News Sentiment</h1>
          <p>
            News analysis refers to the measurement of the various qualitative
            and quantitative attributes of textual (unstructured data) news
            stories.
          </p>
          <p>
            Expressing news stories as numbers and metadata permits the
            manipulation of everyday information in a mathematical and
            statistical way.
          </p>
        </div>
        <DeckGLOverlay
          viewport={viewport}
          data={data}
          news={this.props.allNews}
          colorScale={colorScale}
          tooltipToParent={this.tooltipCallback}
        />
      </MapGL>
    );
  }
}

const mapStateToProps = state => ({
  allNews: state.counter.totalNews,
  loading: state.counter.loading
});

const mapDispatchToProps = dispatch => {
  return {
    // beginSearchForAll: allHoods => {
    //   dispatch(hoodNewsMain(allHoods));
    // },
    manuallyAddNews: news => {
      dispatch(hoodNewsSuccess(news));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
