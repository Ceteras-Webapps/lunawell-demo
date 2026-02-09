import { ContentItem, Notification } from './types';

export const DEFAULT_THEME = {
  textColor: '#4A4A4A',
  backgroundColor: '#FAF9F6', // Off-white/Cream
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: 'Welcome to your personal wellness space.',
    isSystem: true,
    date: new Date().toISOString(),
  },
  {
    id: '2',
    message: 'Remember to drink water today!',
    isSystem: false,
    date: new Date().toISOString(),
  },
];

export const INITIAL_CONTENT: ContentItem[] = [
  /*{
    id: '1',
    title: 'Morning Yoga Flow',
    description: 'A gentle 15-minute sequence to wake up your body and mind.',
    type: 'video',
    url: 'https://www.youtube.com/embed/v7AYKMP6rOE', // Placeholder
  },
  {
    id: '2',
    title: 'Meditation for Anxiety',
    description: 'Calm your nerves with this guided breathing exercise.',
    type: 'class',
    url: 'https://www.youtube.com/embed/inpok4MKVLM', // Placeholder
  },*/
  {
    id: '3',
    title: 'Skin Care Basics',
    description: 'Understanding your skin type and basic routine.',
    type: 'document',
    url: '#',
  },
];

export const TRANSLATIONS = {
  en: {
    title: 'lunawell - Demo',
    myAssistant: 'My Assistant',
    dashboard: 'Dashboard - Demo',
    options: 'Options',
    diary: 'Diary',
    notifications: 'Notifications',
    content: 'Videos & Classes Demo',
    chat: 'Chat',
    welcome: 'Welcome to your sanctuary of simplicity and beauty.',
    save: 'Save',
    delete: 'Delete',
    addNotification: 'Add Reminder',
    addContent: 'Add Content',
    language: 'Language',
    textColor: 'Text Color',
    bgColor: 'Background Color',
    typeMessage: 'Type a message...',
    diaryPlaceholder: 'Dear Diary...',
    newNote: 'New Note',
    saved: 'Saved',
    chatPlaceholder: 'Ask about our classes or wellness tips...',
    infoDashboard: 'Embed a video or document by choosing the appropriate option in the content section. In the full version, you will have access to personalized wellness content, and more.',
    infoQuizzes: 'Add a document or a learn video to create your first quiz. Switch to the "Courses" tab to view and add content.',
  },
  de: {
    title: 'lunawell - Demo',
    myAssistant: 'Meine Assistentin',
    dashboard: 'Dashboard - Demo',
    options: 'Optionen',
    diary: 'Tagebuch',
    notifications: 'Benachrichtigungen',
    content: 'Videos & Kurse Demo',
    chat: 'Chat',
    welcome: 'Willkommen in Ihrem Sanktuarium der Einfachheit und Schönheit.',
    save: 'Speichern',
    delete: 'Löschen',
    addNotification: 'Erinnerung hinzufügen',
    addContent: 'Inhalt hinzufügen',
    language: 'Sprache',
    textColor: 'Textfarbe',
    bgColor: 'Hintergrundfarbe',
    typeMessage: 'Nachricht eingeben...',
    diaryPlaceholder: 'Liebes Tagebuch...',
    newNote: 'Neue Notiz',
    saved: 'Gespeichert',
    chatPlaceholder: 'Fragen Sie nach unseren Kursen oder Wellness-Tipps...',
    infoDashboard: 'Fügen Sie ein Video oder Dokument hinzu, indem Sie die entsprechende Option im Inhaltsbereich auswählen. In der Vollversion haben Sie Zugriff auf personalisierte Wellness-Inhalte und mehr.',
    infoQuizzes: 'Fügen Sie ein Dokument oder ein Lernvideo hinzu, um Ihr erstes Quiz zu erstellen. Wechseln Sie zur Registerkarte "Kurse", um Inhalte anzuzeigen und hinzuzufügen.',
  },
    fr: {
    title: 'lunawell - Demo',
    myAssistant: 'Mon Assistante',
    dashboard: 'Tableau de Bord - Démo',
    options: 'Options',
    diary: 'Journal',
    notifications: 'Notifications',
    content: 'Vidéos & Cours Demo',
    chat: 'Discussion',
    welcome: 'Bienvenue dans votre sanctuaire de simplicité et de beauté.',
    save: 'Enregistrer',
    delete: 'Supprimer',
    addNotification: 'Ajouter un rappel',
    addContent: 'Ajouter du contenu',
    language: 'Langue',
    textColor: 'Couleur du texte',
    bgColor: 'Couleur de fond',
    typeMessage: 'Tapez un message...',
    diaryPlaceholder: 'Cher journal...',
    newNote: 'Nouvelle note',
    saved: 'Enregistré',
    chatPlaceholder: 'Posez des questions sur nos cours ou astuces bien-être...',
    infoDashboard: 'Intégrez une vidéo ou un document en choisissant l\'option appropriée dans la section contenu. Dans la version complète, vous aurez accès à du contenu de bien-être personnalisé, et plus encore.',
    infoQuizzes: 'Ajoutez un document ou une vidéo d\'apprentissage pour créer votre premier quiz. Passez à l\'onglet "Cours" pour voir et ajouter du contenu.',
}
};
