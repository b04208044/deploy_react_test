const mongoose = require('mongoose')
const aggregate_pagination = require('mongoose-aggregate-paginate')
const Schema = mongoose.Schema

const DataSchema = new Schema({
	version:      {type: String },
	UID:          {type: String },
	title:        {type: String },
  category:     {type: String },
  showInfo:
     {
       time:         {type: String},
       location:     {type: String},
       locationName: {type: String},
       onSales:      {type: String},
       price:        {type: String},
       latitude:     {type: Number},
       longitude:    {type: Number},
       endTime:      {type: String}
     },
  showUnit:                  {type: []},
  discountInfo:              {type: []},
  descriptionFilterHtml:     {type: []},
  imageUrl:                  {type: String},
  masterUnit:                {type: []},
  subUnit:                   {type: String},
  supportUnit:               {type: String},
  otherUnit:                 {type: String},
  webSales:                  {type: String},
  sourceWebPromote:          {type: String},
  comment:                   {type: String},
  editModifyDate:            {type: String},
  sourceWebName:             {type: String},
  startDate:                 {type: String},
  endDate:                   {type: String},
  hitRate:                   {type: Number}
})
DataSchema.plugin(aggregate_pagination)

// Creating a table within database with the defined schema
const Dataset = mongoose.model('Dataset', DataSchema)
module.exports = Dataset;
