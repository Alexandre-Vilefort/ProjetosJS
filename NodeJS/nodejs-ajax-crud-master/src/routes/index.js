const express = require('express');
const router = express.Router();

const products = require('../data.json');

router.get('/', (req, res) => {
  res.json(products);
  //console.log(products);
});

router.post('/', (req, res) => {
  console.log(req.body , '########### Post');
  const { name } = req.body;
  products.push({
    id: products.length + 1,
    name
  });
  res.json('Successfully created');
});

router.put('/:id', (req, res) => {
  console.log(req.body,'######### Put')
  const { id } = req.params;
  const { name } = req.body;

  products.forEach((product, i) => {
    if (product.id == id) {
      product.name = name;
    }
  });
  res.json('Successfully updated');

});

router.delete('/:id', (req, res) => {
  const ids = req.params.id;

  products.forEach((product, i) => {
    if(product.id == ids) {
      products.splice(i, 1);
    }
  });
  res.json('Successfully deleted');
});

module.exports = router;