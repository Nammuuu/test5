



import mongoose from 'mongoose';

const pagedataSchema = new mongoose.Schema({
  
  
  // "section": "aboutpage",
  // "updates": [
  //   {
  //     "title": "",
  //     "description": "Updated description",
  //     "smallTitle": "",
  //     "smallDescription": ""
  //   }
  // ],
  
  aboutpage: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      // Flexible structure for additional fields
      
    },
  ],
  shiping: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  cookiesPolicy: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  faq: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  privacy: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  returnexchange: [
    {
      title: { type: String },
      descaription: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  termsconditions: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  contactus: [
    {
      title: { type: String },
      description: { type: String },
      smallTitle: { type: String },
      smallDescription: { type: String },
      
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Pagedata = mongoose.models.Pagedata || mongoose.model('Pagedata', pagedataSchema);
export default Pagedata;

