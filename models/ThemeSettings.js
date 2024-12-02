
import mongoose from 'mongoose';

const themeSettingsSchema = new mongoose.Schema({
  loginlogo: {
    type: String, 
    
  },
  fontfamily: {
    type: String, 
   
  },
  fontcolor: {
    type: String, 
   
  },
  bgcolor: {
    type: String, 
   
  },
  cardbgcolor: {
    type: String, 
   
  },
  isEnabled: {
    type: Boolean, 
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, 
});

const ThemeSettings = mongoose.models.ThemeSettings || mongoose.model('ThemeSettings', themeSettingsSchema)
export default ThemeSettings;
