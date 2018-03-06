import Axios from 'axios';
import URI from 'urijs';
import Sentiment from 'sentiment';

export const HOOD_NEWS_START = 'HOOD_NEWS_START';
export const HOOD_NEWS_SEARCH = 'HOOD_NEWS_SEARCH';
export const HOOD_NEWS_SUCCESS = 'HOOD_NEWS_SUCCESS';
export const HOOD_NEWS_ERROR = 'HOOD_NEWS_ERROR';

const initialState = {
  totalNews: [],
  error: false,
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case HOOD_NEWS_START:
      return {
        ...state,
        loading: true
      };

    case HOOD_NEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        totalNews: action.info
      };

    case HOOD_NEWS_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      };

    default:
      return state;
  }
};

const hoodNewsStart = () => {
  return {
    type: HOOD_NEWS_START
  };
};

export const hoodNewsSuccess = info => {
  return {
    type: HOOD_NEWS_SUCCESS,
    info: info
  };
};
const hoodNewsError = error => {
  return dispatch => {
    dispatch({
      type: HOOD_NEWS_ERROR
    });
  };
};

const addSentiments = oldArticles => {
  let articles = oldArticles;

  for (let article in articles) {
    articles[article].sentiment = Sentiment(
      articles[article].description + articles[article].title
    );
  }

  return articles;
};

export const hoodNewsMain = allHoods => {
  return dispatch => {
    dispatch(hoodNewsStart());

    let hoodId, hoodName, boroughName;
    let totalNews = [];

    for (let key in allHoods) {
      hoodId = allHoods[key].id;
      hoodName = allHoods[key].name;
      boroughName = allHoods[key].borough;

      let newsUrl = new URI('https://newsapi.org/v2/everything?').query({
        q: boroughName + ' ' + hoodName,
        sortBy: 'relevancy',
        apiKey: '962ebee742364f59ac05affe7e440711',
        language: 'en',
        pageSize: 100
      });

      Axios.get(newsUrl)
        .then(response => {
          totalNews.push({
            articles: addSentiments(response.data.articles),
            hoodId: allHoods[key].id,
            hoodName: allHoods[key].name,
            boroughName: allHoods[key].borough
          });

          if (totalNews.length === allHoods.length) {
            dispatch(hoodNewsSuccess(totalNews));
          }
        })
        .catch(error => {});
    }
  };
};
