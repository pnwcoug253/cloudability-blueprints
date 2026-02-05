import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SideNavDivider,
  SkipToContent,
  Content,
  Theme,
} from '@carbon/react';
import {
  Switcher,
  Notification,
  UserAvatar,
  Dashboard,
  Settings,
  Template,
  UserMultiple,
  Analytics,
  ChartLineData,
  Tuning,
  Money,
  Home,
  Code,
  Finance,
} from '@carbon/icons-react';
import { useUser } from '../../context/UserContext';

function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: userState } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const isProfiler = location.pathname.startsWith('/profiler');
  const isLanding = location.pathname === '/';

  return (
    <Theme theme={darkMode ? 'g100' : 'white'}>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="IBM Cloudability">
              <SkipToContent />
              <HeaderName href="/" prefix="IBM" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                Cloudability
              </HeaderName>
              {!isProfiler && !isLanding && (
                <HeaderNavigation aria-label="Main navigation">
                  <HeaderMenuItem onClick={() => navigate('/admin/blueprints')}>
                    Admin Portal
                  </HeaderMenuItem>
                </HeaderNavigation>
              )}
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="Notifications"
                  onClick={() => {}}
                >
                  <Notification size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction
                  aria-label="Toggle dark mode"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <Switcher size={20} />
                </HeaderGlobalAction>
                <HeaderGlobalAction
                  aria-label="User"
                  tooltipAlignment="end"
                >
                  <UserAvatar size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              {!isProfiler && !isLanding && (
                <SideNav
                  aria-label="Side navigation"
                  isRail
                  expanded={isSideNavExpanded}
                >
                  <SideNavItems>
                    {/* Persona Dashboards */}
                    <SideNavMenu title="Dashboards" renderIcon={Home} defaultExpanded>
                      <SideNavMenuItem
                        onClick={() => navigate('/dashboard/finops')}
                        isActive={location.pathname === '/dashboard/finops'}
                      >
                        FinOps Command Center
                      </SideNavMenuItem>
                      <SideNavMenuItem
                        onClick={() => navigate('/dashboard/devops')}
                        isActive={location.pathname === '/dashboard/devops'}
                      >
                        Engineering Cost View
                      </SideNavMenuItem>
                      <SideNavMenuItem
                        onClick={() => navigate('/dashboard/finance')}
                        isActive={location.pathname === '/dashboard/finance'}
                      >
                        Executive Summary
                      </SideNavMenuItem>
                    </SideNavMenu>

                    <SideNavLink renderIcon={ChartLineData} onClick={() => {}}>
                      Reports
                    </SideNavLink>
                    <SideNavLink renderIcon={Tuning} onClick={() => {}}>
                      Optimization
                    </SideNavLink>
                    <SideNavLink renderIcon={Money} onClick={() => {}}>
                      Commitments
                    </SideNavLink>

                    <SideNavDivider />

                    {/* Admin — always visible */}
                    <SideNavMenu title="Admin" renderIcon={Settings} defaultExpanded>
                      <SideNavMenuItem
                        onClick={() => navigate('/admin/blueprints')}
                        isActive={location.pathname === '/admin/blueprints'}
                      >
                        Blueprints
                      </SideNavMenuItem>
                      <SideNavMenuItem
                        onClick={() => navigate('/admin/assignments')}
                        isActive={location.pathname === '/admin/assignments'}
                      >
                        Assignments
                      </SideNavMenuItem>
                      <SideNavMenuItem
                        onClick={() => navigate('/admin/insights')}
                        isActive={location.pathname === '/admin/insights'}
                      >
                        User Insights
                      </SideNavMenuItem>
                    </SideNavMenu>

                    <SideNavDivider />
                    <SideNavLink renderIcon={Settings} onClick={() => {}}>
                      Settings
                    </SideNavLink>
                  </SideNavItems>
                </SideNav>
              )}
            </Header>
            <Content
              className={`app-content${!isProfiler && !isLanding ? (isSideNavExpanded ? ' app-content--nav-expanded' : ' app-content--nav-rail') : ''}`}
            >
              {children}
            </Content>
          </>
        )}
      />
    </Theme>
  );
}

export default AppShell;
