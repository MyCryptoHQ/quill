
const PRODUCTION = 'prod';
const DEVELOPMENT = 'development';

const IS_DEV = process.env.NODE_ENV === DEVELOPMENT;
const IS_PROD = process.env.NODE_ENV === PRODUCTION;

module.exports = {
  PRODUCTION,
  DEVELOPMENT,

  IS_DEV,
  IS_PROD
}