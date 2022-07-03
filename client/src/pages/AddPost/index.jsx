import React, { useRef } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../axios';

import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


export const AddPost = () => {

  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputFileRef = useRef(null);

  const [isLoading, setLoading] = useState(false)

  const handleChangeFile = async (event) => {

    try {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        const { data } = await axios.post('/upload', formData);
        setImageUrl(data.url);
    } catch (error) {
        console.warn(error);
        alert('Ошибка при загрузке файла!');
    }

  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags).join(',');
          setImageUrl(data.imageUrl);
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  const onSubmit = async () => {
    try {
        setLoading(true);

        const fields = {
          title,
          imageUrl: imageUrl,
          tags,
          text
        }
        const { data } = isEditing
          ? await axios.patch(`/posts/${id}`, fields)
          : await axios.post('/posts', fields)

        const _id = isEditing ? id : data._id;

        navigate(`/posts/${_id}`);

    } catch (error) {
        console.warn(error);
        alert('Ошибка при создании статьи');
    }
  }

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/' />
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        variant="standard" placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
