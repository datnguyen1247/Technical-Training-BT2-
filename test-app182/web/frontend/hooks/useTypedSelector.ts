import { useSelector } from 'react-redux';

function getStyleValue(field) {
  return useSelector(state => state.customize.style[field]);
}

export default getStyleValue;
