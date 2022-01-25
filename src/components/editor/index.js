import React, { useRef, useEffect, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function App({setDescription, initialValue}) {
  const [value, setValue] = useState();
  const editorRef = useRef(null);
  useEffect(() => {
    // a real application might do a fetch request here to get the content
    setTimeout(() => setValue(initialValue), 500);
  }, []);
  
  const handleUpdateEditor = (e) => {
    setDescription(e);
  };
  return (
    <>
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        apiKey="du0rpxzhid1m1xoqd9kgmd64wbyxt9r37p7ppsbyq3ji2vhn"
        onEditorChange={(e) => handleUpdateEditor(e)}
        initialValue={value}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
          'bold italic backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </>
  );
}