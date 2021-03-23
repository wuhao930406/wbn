import request from './request';
import bodyParse from './bodyParse';


export async function postFetch({ url, params }) {
  return request(url, {
    method: 'POST',
    data: params,
  });
}

export async function getFetch({ url, params }) {
  return request(url + bodyParse(params));
}