let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const BillWithSettings = require('./bill-with-settings')
const moment = require('moment')
moment().format()

let app = express();

const settingsBill = BillWithSettings()

app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts'
}));
app.set('view engine', 'handlebars');

app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', function (req, res) {
  res.render('index', {
    settings: settingsBill.getSetting(),
    totals: settingsBill.totals(),
    totalClassName: settingsBill.totalClassName()
  });
});

app.post('/settings', function (req, res) {
  settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
  })

  console.log(settingsBill.getSetting());
  res.redirect("/")
});

app.post('/action', function (req, res) {
  settingsBill.recordAction(req.body.actionType)
  res.redirect("/")

})


app.get('/actions', function (req, res) {

  const listOfActions = settingsBill.actions();

  for (action of listOfActions) {
    action.prettyDate = moment(action.timestamp).fromNow();
  }
  res.render("actions", { actions: listOfActions });

})

app.get('/actions/:actionType', function (req, res) {
  const actionType = req.params.actionType;



  const listOfActions = settingsBill.actionsFor(actionType);
  for (action of listOfActions) {
    action.prettyDate = moment(action.timestamp).fromNow();
  }
  res.render("actions", { actions: listOfActions });
})


app.get("/", function (req, res) {
  res.send("Bill Settings WebApp");
});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});