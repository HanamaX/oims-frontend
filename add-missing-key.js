// Simple script to add missing translation key
const fs = require('fs');
const path = require('path');

// Get the LanguageContext.tsx content
const contextFilePath = path.join('c:', 'Users', 'USER', 'OneDrive', 'Desktop', 'oims-frontend', 'contexts', 'LanguageContext.tsx');
let content = fs.readFileSync(contextFilePath, 'utf8');

// Check if the 'no_file_chosen' key exists
if (!content.includes('register.form.no_file_chosen')) {
  // Find the location to insert our new key - look for the last register.form entry
  const lastFormEntryPos = content.lastIndexOf('register.form.');
  if (lastFormEntryPos !== -1) {
    // Find the end of this translation block
    let pos = lastFormEntryPos;
    let bracketCount = 0;
    let foundComma = false;
    
    // Find the closing comma after the last form entry
    while (pos < content.length) {
      if (content[pos] === '{') bracketCount++;
      if (content[pos] === '}') {
        bracketCount--;
        if (bracketCount === 0) {
          // Found the end of the translation object
          let commaPos = content.indexOf(',', pos);
          if (commaPos !== -1 && commaPos < content.indexOf('{', pos)) {
            pos = commaPos + 1;
            foundComma = true;
            break;
          }
        }
      }
      pos++;
    }
    
    if (foundComma) {
      // Insert the new key at this position
      const beforeInsert = content.substring(0, pos);
      const afterInsert = content.substring(pos);
      
      // Add our new translation key
      const newEntry = 
  \
register.form.no_file_chosen\: {
    en: \No
file
chosen\,
    sw: \Hakuna
faili
iliyochaguliwa\
  },;
      
      content = beforeInsert + newEntry + afterInsert;
      
      // Write the updated content back
      fs.writeFileSync(contextFilePath, content, 'utf8');
      console.log('Added missing translation key: register.form.no_file_chosen');
    }
  }
}

// Add any other missing keys here using the same pattern
// ...

console.log('Script completed');

