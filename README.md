# Конфигуратор лодки

Проект уже готов к публикации как статический сайт на GitHub Pages.

## Что загрузить в GitHub

В репозиторий нужно загрузить:

- `index.html`
- `script.js`
- `styles.css`
- папку `1 раздел выбор цвета борта и палубы`
- при необходимости `tilda-block.html`, `ПК.html`, `Телефон.html`

## Как опубликовать

1. Создайте новый репозиторий на GitHub.
2. Загрузите в него все файлы этого проекта.
3. Откройте `Settings` -> `Pages`.
4. В блоке `Build and deployment` выберите:
   `Source` -> `Deploy from a branch`
5. Выберите:
   `Branch` -> `main`
   `Folder` -> `/ (root)`
6. Сохраните настройки.

После публикации ссылка будет такого вида:

`https://USERNAME.github.io/REPOSITORY/`

## Как вставить на сайт

Самый простой и надежный способ: вставить конфигуратор через `iframe`.

Пример:

```html
<iframe
  src="https://USERNAME.github.io/REPOSITORY/"
  width="100%"
  height="1600"
  style="border:0;display:block;width:100%;max-width:100%;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

## Для Tilda

В Tilda можно добавить блок `T123` и вставить туда этот код:

```html
<div style="width:100%;max-width:1280px;margin:0 auto;">
  <iframe
    src="https://USERNAME.github.io/REPOSITORY/"
    width="100%"
    height="1600"
    style="border:0;display:block;width:100%;"
    loading="lazy"
  ></iframe>
</div>
```

## Важно

- Замените `USERNAME` на ваш логин GitHub.
- Замените `REPOSITORY` на имя репозитория.
- Если высоты `1600` мало, увеличьте ее до `1800` или `2000`.
- Все пути в проекте уже относительные, поэтому GitHub Pages должен открыть конфигуратор без дополнительной сборки.

## Если нужен прямой домен

Можно подключить и свой домен, например:

`config.example.ru`

Но сначала лучше проверить работу через стандартный адрес GitHub Pages.
