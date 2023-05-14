import React, { useRef, useState, useEffect } from 'react'
import Header from '../components/Header';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { chatCompletion } from '../api/chat.api';
import { toast } from 'react-toastify';
import TypeWriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, FormControl, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';


const messageType = {
  answer: 'answer',
  question: 'question'
}

const FormControlStyle = {
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#94989b',
    },
  },
}



const HomePage = () => {
  const username = localStorage.getItem('username')

  const navigate = useNavigate();
  const inputRef = useRef();
  const chatWrapperRef = useRef();
  const [onRequest, setOnRequest] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);

  const getAnswer = async () => {
    if (onRequest) return

    const newMessages = [...messages, {
      type: messageType.question,
      content: question
    }]

    setMessages(newMessages)
    setQuestion('')
    setOnRequest(true)


    const { response, err } = await chatCompletion({ prompt: question })
    if (response) {
      setMessages([...newMessages, {
        type: messageType.answer,
        content: response.text
      }]);
    }
    if (err) {
      toast.error(err.message);
      setOnRequest(false);
    }
  };

  const onEnterPress = (e) => {
    if (e.keyCode === 13) getAnswer()
  }
  const onSignOut = () => {
    localStorage.removeItem('tkn');
    navigate('/signin');
  };

  useEffect(() => {
    setTimeout(() => {
      if (chatWrapperRef.current) {
        const scrollChatWrapper = () => {
          chatWrapperRef.current.scroll({
            top: chatWrapperRef.current.scrollHeight,
            behavior: 'smooth'
          });
        };

        chatWrapperRef.current.addEventListener('DOMNodeInserted', scrollChatWrapper);

        return () => {
          chatWrapperRef.current.removeEventListener('DOMNodeInserted', scrollChatWrapper);
        };
      }
    }, 200)
  }, []);

  return (
    <Stack
      justifyContent='space-between'
      alignItems='center'
      sx={{ height: '100%' }}

    >
      <Header >
        <Box sx={{
          width: '100%',
          height: '100%',
          padding: 2,
          maxWidth: 'md'
        }}>
          <Typography
            variant='h6'
            fontWeight='700'
            sx={{
              position: 'absolute',
              left: '20px',
              transform: 'translateY(-50%)'
            }}
          >
            {username}
          </Typography>
          <IconButton
            onClick={onSignOut}
            sx={{
              position: 'absolute',
              right: '20px',
              transform: 'translateY(-50%)'
            }}
          >
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
      </Header>

      <Box
        ref={chatWrapperRef || undefined}
        sx={{
          height: '100%',
          position: 'fixed',
          zIndex: 1,
          maxWidth: 'md',
          width: '100%',
          overflowY: 'auto',
          paddingTop: '60px',
          paddingBottom: '90px',
          '&::-webkit-scrollbar': {
            width: '0px'
          }

        }}
      >
        <Box
          sx={{
            display: 'flxe',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            maxWidth: 'md',
            width: '100%'
          }}
        >
          {messages.map((item, index) => (
            <Box key={index} padding={2}>
              <Box
                sx={{
                  padding: 2,
                  color: item.type === messageType.answer && '#beb8b8',
                  bgcolor: item.type === messageType.answer && '#363535',
                  borderRadius: 3,
                  border: item.type === messageType.answer ? '1px solid black' : '1px solid #beb8b8'
                }}
              >
                {index === messages.length - 1 ? (
                  item.type === messageType.answer ? (
                    <TypeWriter
                      onInit={(writer) => {
                        writer.typeString(item.content).callFunction(() => {
                          document.querySelector('.Typewriter__cursor').style.display = 'none ';
                          setOnRequest(false);
                          setTimeout(() => {
                            inputRef.current.focus();
                          }, 200);
                        }).changeDelay(30).start();
                      }}
                    />
                  ) : item.content
                ) : (
                  item.content
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Stack
        width='100%'
        justifyContent='center'
        alignItems='center'
        borderTop='1px solid #2c2c2c'
        zIndex={3}
      >
        <Box
          padding={3}
          width='100%'
          maxWidth='md'
        >
          <FormControl fullWidth variant='outlined' sx={FormControlStyle}>
            <OutlinedInput
              inputRef={inputRef}
              sx={{
                '&.MuiOutlineInput-notchedOutline': {
                  border: 'none'
                }
              }}
              endAdornment={
                onRequest ? (
                  <CircularProgress sixe='1.5rem' />
                ) : (
                  <SendOutlinedIcon />
                )
              }
              autoFocus
              disabled={onRequest}
              onKeyUp={onEnterPress}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='Ask something...'
            />
          </FormControl>
        </Box>
      </Stack>
    </Stack>
  )
}

export default HomePage