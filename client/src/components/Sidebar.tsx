import React from 'react';
import { styled } from "@mui/system";
import { FaChartBar, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { BsChatLeftTextFill } from "react-icons/bs";
import { Box, Divider, Drawer, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import SignIn from './sign-in';
import { useEffect, useState } from 'react';
import { onAuthStateChangedHelper } from '../firebase';
import { User } from 'firebase/auth';
import robotLogo from '../static/1.png';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  });

  const SidebarContainer = styled(Drawer)(({ theme }) => ({
    width: 80,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 80,
      position: "fixed",
      height: "100vh",
      backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
      transition: "all 0.3s ease",
      borderRight: "1px solid rgba(0, 0, 0, 0.12)"
    }
  }));

  const IconContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2, 0),
    gap: theme.spacing(3)
  }));

  const StyledIconButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'active',
  })<{ active?: number }>(({ theme, active }) => ({
    color: active ? (theme?.palette?.primary?.main || '#1976d2') : (theme?.palette?.text?.secondary || '#666'),
    transition: "all 0.3s ease",
    "&:hover": {
      color: theme?.palette?.primary?.main || '#1976d2',
      transform: "scale(1.1)"
    }
  }));

  const MobileNav = styled(Box)(({ theme }) => ({
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "space-around",
    zIndex: 1200
  }));
  const navigationItems = [
    { id: "chats", icon: BsChatLeftTextFill, label: "Chats", path: "/loggedin", showDivider: true },
    { id: "stats", icon: FaChartBar, label: "Stats", path: "/stats" },
    { id: "profile", icon: FaUser, label: "Profile", path: "/profile" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const LogoContainer = styled(Box)({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      width: '40px',
      height: '40px',
      objectFit: 'contain'
    }
  });

  const renderNavigationItems = () => (
    <IconContainer>
      <LogoContainer>
        <img src={robotLogo} alt="Robot Logo" />
      </LogoContainer>
      {navigationItems.map((item) => (
        <React.Fragment key={item.id}>
          {item.showDivider && (
            <Divider
              sx={{
                width: '60%',
                margin: '8px auto',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
              }}
            />
          )}
          <Tooltip title={item.label} placement="right">
            <StyledIconButton
              active={location.pathname === item.path ? 1 : 0}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
            >
              <item.icon size={24} />
            </StyledIconButton>
          </Tooltip>
        </React.Fragment>
      ))}
    </IconContainer>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          sx={{ position: "fixed", top: 10, left: 10, zIndex: 1300 }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </IconButton>

        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5"
            }
          }}
        >
          {renderNavigationItems()}
        </Drawer>

        <MobileNav>
          {navigationItems.map((item) => (
            <Tooltip key={item.id} title={item.label} placement="top">
              <StyledIconButton
                active={location.pathname === item.path ? 1 : 0}
                onClick={() => handleNavigation(item.path)}
                aria-label={item.label}
              >
                <item.icon size={20} />
              </StyledIconButton>
            </Tooltip>
          ))}
        </MobileNav>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <SidebarContainer variant="permanent">
        {renderNavigationItems()}
        <Box sx={{
          position: "fixed",
          bottom: 16,
          width: 80,
          display: "flex",
          justifyContent: "center"
        }}>
          <Divider />
          <SignIn user={user} />
        </Box>
      </SidebarContainer>
    </Box>
  );
}