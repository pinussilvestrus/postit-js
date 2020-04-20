
import {
  assign
} from 'min-dash';

import Moddle from './Moddle';

import PostitDescriptors from './resources/postit.json';
import DiDescriptors from './resources/postitDi.json';
import DcDescriptors from './resources/dc.json';

var packages = {
  postit: PostitDescriptors,
  postitDi: DiDescriptors,
  dc: DcDescriptors,
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new Moddle(pks, options);
}
