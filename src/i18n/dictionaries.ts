export type TranslationDict = {
  common: {
    logout: string
    cancel: string
    save: string
    delete: string
    loading: string
    actions: string
    createdAt: string
    search: string
    all: string
    optional: string
  }
  nav: {
    posts: string
    authors: string
    tags: string
  }
  login: {
    title: string
    subtitle: string
    email: string
    password: string
    submit: string
    emailRequired: string
    emailInvalid: string
    passwordRequired: string
    failed: string
  }
  posts: {
    title: string
    newPost: string
    editPost: string
    searchPlaceholder: string
    allAuthors: string
    preview: string
    postTitle: string
    author: string
    tags: string
    text: string
    previewPicture: string
    selectFile: string
    selectAuthor: string
    selectTags: string
    enterTitle: string
    enterText: string
    noPosts: string
    count: string
    deleteConfirmTitle: string
    deleteConfirmContent: string
    deleted: string
    created: string
    updated: string
    loadFailed: string
    previewRequired: string
    selectImage: string
    remove: string
    removePreview: string
    previewHint: string
  }
  authors: {
    title: string
    newAuthor: string
    editAuthor: string
    name: string
    lastName: string
    secondName: string
    shortDescription: string
    description: string
    avatar: string
    noAuthors: string
    count: string
    deleteConfirmTitle: string
    deleteConfirmContent: string
    deleted: string
    created: string
    updated: string
    loadFailed: string
    enterName: string
    enterLastName: string
  }
  tags: {
    title: string
    newTag: string
    editTag: string
    name: string
    code: string
    priority: string
    noTags: string
    count: string
    deleteConfirmTitle: string
    deleteConfirmContent: string
    deleted: string
    created: string
    updated: string
    loadFailed: string
    enterName: string
  }
  orphan: {
    deleted: string
    deletedWithId: string
    deletedWithName: string
  }
}

export const ru: TranslationDict = {
  common: {
    logout: 'Выйти',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    loading: 'Загрузка…',
    actions: 'Действия',
    createdAt: 'Создан',
    search: 'Поиск',
    all: 'Все',
    optional: 'Необязательно',
  },
  nav: {
    posts: 'Управление постами',
    authors: 'Авторы',
    tags: 'Теги',
  },
  login: {
    title: 'Вход',
    subtitle: 'Введите учётные данные, чтобы продолжить.',
    email: 'Email',
    password: 'Пароль',
    submit: 'Войти',
    emailRequired: 'Введите email',
    emailInvalid: 'Некорректный email',
    passwordRequired: 'Введите пароль',
    failed: 'Не удалось войти',
  },
  posts: {
    title: 'Посты',
    newPost: 'Новый пост',
    editPost: 'Редактировать пост',
    searchPlaceholder: 'Поиск по заголовку',
    allAuthors: 'Все авторы',
    preview: 'Превью',
    postTitle: 'Заголовок',
    author: 'Автор',
    tags: 'Теги',
    text: 'Текст',
    previewPicture: 'Превью',
    selectFile: 'Выбрать файл',
    selectAuthor: 'Выберите автора',
    selectTags: 'Выберите теги',
    enterTitle: 'Введите заголовок',
    enterText: 'Введите текст',
    noPosts: 'Нет постов',
    count: '{{count}} постов',
    deleteConfirmTitle: 'Удалить этот пост?',
    deleteConfirmContent: 'Это действие нельзя отменить.',
    deleted: 'Пост удалён',
    created: 'Пост создан',
    updated: 'Пост обновлён',
    loadFailed: 'Не удалось загрузить посты',
    previewRequired: 'Загрузите превью поста',
    selectImage: 'Выберите изображение',
    remove: 'Удалить',
    removePreview: 'Удалить превью',
    previewHint: 'Обязательное поле. JPG, PNG, WEBP или GIF.',
  },
  authors: {
    title: 'Авторы',
    newAuthor: 'Новый автор',
    editAuthor: 'Редактировать автора',
    name: 'Имя',
    lastName: 'Фамилия',
    secondName: 'Отчество',
    shortDescription: 'Краткое описание',
    description: 'Описание',
    avatar: 'Аватар',
    noAuthors: 'Нет авторов',
    count: '{{count}} авторов',
    deleteConfirmTitle: 'Удалить этого автора?',
    deleteConfirmContent: 'Это действие нельзя отменить.',
    deleted: 'Автор удалён',
    created: 'Автор создан',
    updated: 'Автор обновлён',
    loadFailed: 'Не удалось загрузить авторов',
    enterName: 'Введите имя',
    enterLastName: 'Введите фамилию',
  },
  tags: {
    title: 'Теги',
    newTag: 'Новый тег',
    editTag: 'Редактировать тег',
    name: 'Название',
    code: 'Код',
    priority: 'Приоритет',
    noTags: 'Нет тегов',
    count: '{{count}} тегов',
    deleteConfirmTitle: 'Удалить этот тег?',
    deleteConfirmContent: 'Это действие нельзя отменить.',
    deleted: 'Тег удалён',
    created: 'Тег создан',
    updated: 'Тег обновлён',
    loadFailed: 'Не удалось загрузить теги',
    enterName: 'Введите название',
  },
  orphan: {
    deleted: 'Удален',
    deletedWithId: 'ID: {{id}} (Удален)',
    deletedWithName: '{{name}} (Удален)',
  },
}

export const en: TranslationDict = {
  common: {
    logout: 'Logout',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    loading: 'Loading…',
    actions: 'Actions',
    createdAt: 'Created At',
    search: 'Search',
    all: 'All',
    optional: 'Optional',
  },
  nav: {
    posts: 'Posts Management',
    authors: 'Authors',
    tags: 'Tags',
  },
  login: {
    title: 'Sign in',
    subtitle: 'Enter your credentials to continue.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    emailRequired: 'Enter your email',
    emailInvalid: 'Invalid email address',
    passwordRequired: 'Enter your password',
    failed: 'Sign in failed',
  },
  posts: {
    title: 'Posts',
    newPost: 'New post',
    editPost: 'Edit post',
    searchPlaceholder: 'Search by title',
    allAuthors: 'All authors',
    preview: 'Preview',
    postTitle: 'Title',
    author: 'Author',
    tags: 'Tags',
    text: 'Text',
    previewPicture: 'Preview picture',
    selectFile: 'Select file',
    selectAuthor: 'Select author',
    selectTags: 'Select tags',
    enterTitle: 'Enter title',
    enterText: 'Enter text',
    noPosts: 'No posts',
    count: '{{count}} posts',
    deleteConfirmTitle: 'Delete this post?',
    deleteConfirmContent: 'This action cannot be undone.',
    deleted: 'Post deleted',
    created: 'Post created',
    updated: 'Post updated',
    loadFailed: 'Failed to load posts',
    previewRequired: 'Upload a post preview',
    selectImage: 'Select an image',
    remove: 'Remove',
    removePreview: 'Remove preview',
    previewHint: 'Required. JPG, PNG, WEBP or GIF.',
  },
  authors: {
    title: 'Authors',
    newAuthor: 'New author',
    editAuthor: 'Edit author',
    name: 'Name',
    lastName: 'Last name',
    secondName: 'Second name',
    shortDescription: 'Short description',
    description: 'Description',
    avatar: 'Avatar',
    noAuthors: 'No authors',
    count: '{{count}} authors',
    deleteConfirmTitle: 'Delete this author?',
    deleteConfirmContent: 'This action cannot be undone.',
    deleted: 'Author deleted',
    created: 'Author created',
    updated: 'Author updated',
    loadFailed: 'Failed to load authors',
    enterName: 'Enter name',
    enterLastName: 'Enter last name',
  },
  tags: {
    title: 'Tags',
    newTag: 'New tag',
    editTag: 'Edit tag',
    name: 'Name',
    code: 'Code',
    priority: 'Priority',
    noTags: 'No tags',
    count: '{{count}} tags',
    deleteConfirmTitle: 'Delete this tag?',
    deleteConfirmContent: 'This action cannot be undone.',
    deleted: 'Tag deleted',
    created: 'Tag created',
    updated: 'Tag updated',
    loadFailed: 'Failed to load tags',
    enterName: 'Enter name',
  },
  orphan: {
    deleted: 'Deleted',
    deletedWithId: 'ID: {{id}} (Deleted)',
    deletedWithName: '{{name}} (Deleted)',
  },
}
