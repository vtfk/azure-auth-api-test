import React, { useState } from 'react'
import { useSession } from '@vtfk/react-msal'
import { useLocation, Link } from 'react-router-dom'
import { SideNav, SideNavItem, InitialsBadge, Paragraph, SkipLink, IconDropdownNav, IconDropdownNavItem, Icon, Logo } from '@vtfk/components'
import ScrollLock, { TouchScrollable } from 'react-scrolllock'

import { ROUTES } from '../config'
import './styles.scss'

export function Layout (props) {
  const { user, logout, idToken, token } = useSession()
  const location = useLocation()
  const [openTopNavSide, setOpenTopNavSide] = useState(false)
  const [scrollLock, setScrollLock] = useState(false)

  function copyToken (type) {
    const tokenField = document.getElementById('hidden-token')
    tokenField.value = type === 'idToken' ? idToken : token
    tokenField.select()
    tokenField.setSelectionRange(0, 99999) // for mobile devices
    document.execCommand('copy')
  }

  function clickTopNavToggle () {
    const newIsOpen = !openTopNavSide
    setOpenTopNavSide(newIsOpen)

    if (newIsOpen && window.innerWidth <= 1000) {
      setScrollLock(true)
    } else {
      setScrollLock(false)
    }

    return newIsOpen
  }

  function clickContainer () {
    if (openTopNavSide) setOpenTopNavSide(false)
  }

  return (
    <div>
      <input type='text' id='hidden-token' className='hidden-token' tabIndex={-1} />

      <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>

      <div className='layout'>
        <SideNav title={<>API test</>}>
          <SideNavItem icon={<Icon name='home' />} active={location.pathname === '/'} href='/' title='Forside' />
          <SideNavItem icon={<Icon name='help' />} active={location.pathname === `/${ROUTES.HELP}`} href={`/${ROUTES.HELP}`} title='Hjelp' />
        </SideNav>

        <nav role='navigation' className={`topnav-side ${openTopNavSide ? 'open' : ''}`}>
          <div className='topnav-side-user'>
            <div className='user'>
              <InitialsBadge className='user-image' firstName={user.givenName} lastName={user.surname} />
              <div className='user-name'>
                <Paragraph>{user.displayName}</Paragraph>
              </div>
              <div className='user-menu'>
                <IconDropdownNav>
                  <IconDropdownNavItem onClick={() => copyToken('idToken')} title='Copy id-token' />
                  <IconDropdownNavItem onClick={() => copyToken('token')} title='Copy token' />
                  <IconDropdownNavItem onClick={() => logout()} title='Logg ut' />
                </IconDropdownNav>
              </div>
            </div>

            <button aria-label='Lukk meny' title='Lukk menyen' className='topnav-side-top-close' onClick={clickTopNavToggle}>
              <Icon name='close' size='xsmall' />
            </button>
          </div>

          <TouchScrollable>
            <div className='topnav-side-list'>
              <div className='topnav-side-list-inner'>
                <Link className={`topnav-side-list-item ${location.pathname === '/' ? 'active' : ''}`} to='/'>
                  <div className='topnav-side-list-item-icon'><Icon size='medium' name='home' /></div>
                  <div className='topnav-side-list-item-text'>Forside</div>
                </Link>
                <Link className={`topnav-side-list-item ${location.pathname === '/' + ROUTES.HELP ? 'active' : ''}`} to={`/${ROUTES.HELP}`}>
                  <div className='topnav-side-list-item-icon'><Icon size='medium' name='help' /></div>
                  <div className='topnav-side-list-item-text'>Hjelp</div>
                </Link>
              </div>
            </div>
          </TouchScrollable>
        </nav>

        <div className='container' onClick={() => { clickContainer() }}>
          <header className='topnav'>
            <a href='/' className='topnav-brand'>
              <div className='brand-logo' aria-hidden>
                <Logo />
              </div>
              <div className='brand-name'>
                API test
              </div>
            </a>
            <div className='topnav-toggles'>
              <button aria-label='Åpne meny' title='Åpne menyen' onClick={clickTopNavToggle}>
                <Icon size='small' name='menu' />
              </button>
            </div>
          </header>

          <div className='action-bar'>
            <div className='search'>
              {/*   <SearchField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onSearch={() => { window.location.replace(`/${ROUTES.students}?s=${searchTerm || ''}`) }}
                placeholder='Søk etter elev ...'
                className='search-input'
                rounded
              /> */}
            </div>

            <div className='user'>
              <div className='user-name'>
                <Paragraph>{user.displayName}</Paragraph>
              </div>
              <InitialsBadge className='user-image' firstName={user.givenName} lastName={user.surname} />
              <div className='user-menu'>
                <IconDropdownNav>
                  <IconDropdownNavItem onClick={() => copyToken('idToken')} title='Copy id-token' />
                  <IconDropdownNavItem onClick={() => copyToken('token')} title='Copy token' />
                  <IconDropdownNavItem onClick={() => logout()} title='Logg ut' />
                </IconDropdownNav>
              </div>
            </div>
          </div>

          <ScrollLock isActive={scrollLock}>
            <div id='main-content' {...props}>
              {props.children}
            </div>
          </ScrollLock>
        </div>
      </div>
    </div>
  )
}
