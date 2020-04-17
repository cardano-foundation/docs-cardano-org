import React from 'react'
import Box from '@material-ui/core/Box'
import Theme from '@input-output-hk/front-end-core-components/components/Theme'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Layout from '../components/Layout'
import InfoBox from '../components/InfoBox'
import IndexPageQuery from '../queries/IndexPageQuery'
import styled from 'styled-components'
import FullWidthSection from '../components/FullWidthSection'
import Markdown from '@input-output-hk/front-end-core-components/components/Markdown'
import { makeTransparent } from '../helpers/color'
import { Consumer as ScreenSizeConsumer } from '../state/ScreenSize'
import { withStyles } from '@material-ui/core/styles'

const HeroSection = styled.section`
  text-align:center;
`

const OuroborosSection = styled.section`
  p {
    color: ${({ theme }) => makeTransparent(theme.colors.primary.contrastText, 0.85)};
  }
  ul {
    list-style-type:none;
    margin:7rem 0 0;
    li {
      display:inline-block;
      border-left:.3rem solid #fff;
      padding:.5rem 3.5rem .5rem 1.5rem;
      h4 {
        margin:0;
      }
      a {
        display:inline-block;
      }
    }
  }
`

const OuroborosImage = styled.img`
  mix-blend-mode: lighten;
  object-fit: contain;
`

const OuroborosLogo = styled.img`
width: 68px;
height: 40px;
object-fit: contain;
`

const TopicsSection = styled.div`
  background:url('/images/uploads/topics-bg.png') no-repeat center center;
  background-size:45rem;
  text-align:center;
  ul {
    display:flex;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      flex-direction:column;
    }
    li {
      background:${({ theme }) => makeTransparent(theme.palette.secondary.light, 0.7)};
      display:inline-block;
      margin:0 1rem;
      ${({ theme }) => theme.breakpoints.up('md')} {
        width:33%;
      }
      vertical-align:middle;
      .inner {
        color: ${({ theme }) => makeTransparent(theme.colors.primary.contrastText, 0.7)};
        padding:4rem 5rem;
        img {
          height: 6rem;
          width:auto;
          object-fit: contain;
        }
      }
    }
  }
`

const Clear = styled.div`
clear:both;
`

const StyledButton = withStyles({
  root: {
    color: 'black',
    fontSize: '1.4rem'
  }
})(Button)

export default () => (
  <Theme.Consumer>
    {({ theme }) => (
      <IndexPageQuery
        render={(content) => (
          <ScreenSizeConsumer>
            {({ screenSize, screenWidth }) => (
              <Layout>
                {console.log(theme)}
                <Container maxWidth={(screenWidth > 2048) ? 'xl' : 'lg'}>
                  <FullWidthSection background={`#070d22 url('/images/uploads/hh.png') no-repeat center center`}>
                    <Box paddingTop={5} paddingBottom={5}>
                      <HeroSection>
                        <Box maxWidth='80rem' display='inline-block' marginBottom={3}>
                          <Typography variant='h1'>{content.hero.hero_title}</Typography>
                          <Box maxWidth='80rem' display='inline-block' marginBottom={5}>
                            <Typography variant='h2'>{content.hero.hero_subtitle}</Typography>
                          </Box>
                        </Box>
                        <Clear />
                        <Box maxWidth='65rem' display='inline-block' marginBottom={15}>
                          <InfoBox>
                            <Box marginBottom={5}>
                              <Typography>{content.hero.hero_body}</Typography>
                            </Box>
                            <StyledButton variant='contained' size='large' color='primary' href={content.hero.hero_cta_link}>{content.hero.hero_cta}</StyledButton>
                          </InfoBox>
                        </Box>
                      </HeroSection>
                    </Box>
                  </FullWidthSection>
                  <OuroborosSection>
                    <FullWidthSection background={theme.palette.secondary.light}>
                      <Box paddingTop={5} paddingBottom={8}>
                        <Grid container>
                          <Grid item md={6}>
                            <OuroborosLogo src='/images/uploads/ouroboros-logo.svg' alt='' />
                            <Typography component='div' variant='h3'>
                              <Markdown source={content.ouroboros.ouroboros_lead} />
                            </Typography>
                            <Box marginTop={3}>
                              <Typography component='div'>
                                <Markdown source={content.ouroboros.ouroboros_body} />
                              </Typography>
                            </Box>
                            <ul>
                              {content.ouroboros.ouroboros_links.map((link, index) => (
                                <li key={index}>
                                  <Typography variant='h4'>{link.ouroboros_link_title}</Typography>
                                </li>
                              ))}
                            </ul>
                          </Grid>
                          <Grid item md={6}>
                            <OuroborosImage src='/images/uploads/ouroboros.png' alt='' />
                          </Grid>
                        </Grid>
                      </Box>
                    </FullWidthSection>
                  </OuroborosSection>
                  <TopicsSection>
                    <Box paddingTop={15} paddingBottom={15}>
                      <ul>
                        {content.topics.map((topic, index) => (
                          <li key={index}>
                            <div className='inner'>
                              <Box marginBottom={3} maxHeight='6rem'>
                                <a href={topic.topic_link}><img src={topic.topic_icon} alt='' /></a>
                              </Box>
                              <Box marginBottom={4}>
                                <Typography>{topic.topic_body}</Typography>
                              </Box>
                              <Box>
                                <Typography variant='h5'><a href={topic.topic_link}>{topic.topic_title}</a></Typography>
                              </Box>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </TopicsSection>
                </Container>
              </Layout>
            )}
          </ScreenSizeConsumer>
        )}
      />
    )}
  </Theme.Consumer>
)
