const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const Chuck  = require('chucknorris-io');
const client = new Chuck();
const bodyParser = require('body-parser');

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout')

app.get('/', (req, res, next) => {
  res.render('index');
})

app.get('/random', (req, res) => {
  client.getRandomJoke()
    .then((response) => {
      console.log(response)
      res.render('random', {
        categories: response.categories,
        iconUrl: response.iconUrl,
        id: response.id,
        sourceUrl: response.sourceUrl,
        value: response.value
      })
    }).catch((err) => {
      console.log(err)
    })
})

app.get('/categories', (req, res, next) => {
  let category = req.query.cat

  if (!category) {
    client.getJokeCategories()
      .then((response) => {
        res.render('categories', {
          categories: response
        })
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
      client.getRandomJoke(category)
        .then((response) => {
          res.render('joke-by-category', {
            cat: req.query.cat,
            iconUrl: response.iconUrl,
            value: response.value
          })
        }).catch((err) => {
          console.log(err)
        })
  }
})

app.get('/search', (req, res) => {
  res.render('search-form')
})

app.post('/search', (req, res) => {
  let category = req.body.category

  client.search(category)
    .then((response) => {
      let joke = response.items[Math.floor(Math.random() * response.items.length)].value;
      res.send(`${joke}`)
    }).catch((err) => {
      console.log(err)
    })
})

app.listen(3000, () => {
  console.log('Chuck Norris listening')
});
