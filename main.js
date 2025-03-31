const fs = require('fs');
const process = require('process');


const filePath = 'notlar.json';


if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
  console.log('✅ notlar.json dosyası oluşturuldu.');
}

function addNote(noteContent) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const notes = JSON.parse(data);

    
    const highestId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0;
    const newId = highestId + 1;

    const newNote = { id: newId, content: noteContent };
    notes.push(newNote);

    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
    console.log(`✅ Yeni not eklendi. ID: ${newId}`);
  } catch (err) {
    console.error('❌ Hata oluştu:', err);
  }
}


function listNotes() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const notes = JSON.parse(data);

    if (notes.length === 0) {
      console.log('📂 Henüz kaydedilmiş bir not bulunmamaktadır.');
    } else {
      console.log('📜 Tüm Notlar:');
      notes.forEach(note => {
        console.log(`${note.id} - ${note.content}`);
      });
    }
  } catch (err) {
    console.error('❌ Hata oluştu:', err);
  }
}


function deleteNote(noteId) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    let notes = JSON.parse(data);

    
    const updatedNotes = notes.filter(note => note.id !== Number(noteId));

    if (updatedNotes.length === notes.length) {
      console.log(`❌ ID (${noteId}) ile eşleşen not bulunamadı.`);
    } else {
      
      const reorderedNotes = updatedNotes.map((note, index) => ({
        id: index + 1,
        content: note.content
      }));

      fs.writeFileSync(filePath, JSON.stringify(reorderedNotes, null, 2));
      console.log(`🗑️ Not başarıyla silindi. ID: ${noteId}`);
      console.log(`🔄 ID'ler yeniden düzenlendi.`);
    }
  } catch (err) {
    console.error('❌ Hata oluştu:', err);
  }
}

  


const args = process.argv.slice(2);
const command = args[0];
const parameter = args[1]; 

if (command === 'ekle' && parameter) {
  addNote(parameter); // 
} else if (command === 'listele') {
  listNotes(); // 
} else if (command === 'sil' && parameter) {
  deleteNote(parameter); 
} else {
  console.log('🚨 Geçersiz komut veya eksik parametre! Kullanım şekilleri:');
  console.log('➡️ Yeni not eklemek için: node main.js ekle "Not içeriği"');
  console.log('➡️ Tüm notları listelemek için: node main.js listele');
  console.log('➡️ Belirli bir notu silmek için: node main.js sil <ID>');
}
