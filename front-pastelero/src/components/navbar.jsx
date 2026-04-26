import { useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../context";
import { CartContext } from "./enuser/carritocontext";
import { Poppins as PoppinsFont, Sofia as SofiaFont } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const poppins = PoppinsFont({ subsets: ["latin"], weight: ["400", "700"] });
const sofia = SofiaFont({ subsets: ["latin"], weight: ["400"] });
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ─── Icon helpers ──────────────────────────────────────────── */
const BellIcon = ({ size = 22 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CartIcon = ({ size = 22 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
  </svg>
);

const HelpIcon = ({ size = 22 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const CloseIcon = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HamburgerIcon = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h14M5 12h14M5 17h14" />
  </svg>
);

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ─── Notification dropdown ─────────────────────────────────── */
const NotificationDropdown = ({ notifications, onDelete, linkHref, innerRef }) => (
  <div
    ref={innerRef}
    className={`${poppins.className} absolute right-0 w-80 rounded-2xl overflow-hidden z-50`}
    style={{
      background: "#fff",
      border: "1px solid var(--border-color)",
      boxShadow: "var(--shadow-lg)",
      top: "calc(100% + 8px)",
    }}
  >
    {/* Header */}
    <div
      className="flex items-center gap-2 py-3 px-4 font-bold text-sm"
      style={{ background: "var(--burdeos)", color: "#fff" }}
    >
      <BellIcon size={16} />
      Notificaciones
    </div>

    {notifications.length === 0 ? (
      <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Sin notificaciones nuevas
      </div>
    ) : (
      <ul className="max-h-64 overflow-y-auto divide-y" style={{ borderColor: "var(--border-color)" }}>
        {notifications.map((n) => (
          <Link
            href={linkHref}
            key={n._id}
            className="flex items-start justify-between gap-2 px-4 py-3 transition-colors hover:bg-rosa-4"
            style={{ background: n.leida ? "var(--crema)" : "#fff", display: "flex" }}
          >
            <div className="flex items-start gap-2 min-w-0">
              {!n.leida && (
                <span
                  className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ background: "#22c55e" }}
                />
              )}
              <span className="text-sm leading-snug" style={{ color: "var(--color-text)" }}>
                {n.mensaje}
              </span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); onDelete(n._id); }}
              className="flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-rosa-4"
              style={{ color: "var(--rosa)" }}
              aria-label="Eliminar notificación"
            >
              <XIcon />
            </button>
          </Link>
        ))}
      </ul>
    )}
  </div>
);

/* ─── Component ─────────────────────────────────────────────── */
const NavbarAdmin = () => {
  const { isAdmin, setIsAdmin, isLoggedIn, setIsLoggedIn, userEmail, logout, userId } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { asPath } = router;
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  const [notificacionesUsuario, setNotificacionesUsuario] = useState([]);
  const [showNotificacionesUsuario, setShowNotificacionesUsuario] = useState(false);
  const [markAsReadOnClose, setMarkAsReadOnClose] = useState(false);
  const notificacionesUsuarioRef = useRef(null);
  const notificacionesRef = useRef(null);

  const cart = useContext(CartContext);
  const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

  const handleNavigation = () => { router.push("/dashboard"); };
  const toggleDropdown = () => { setDropdownOpen(!dropdownOpen); };
  const closeDropdown = () => { setDropdownOpen(false); };

  const toggleNotificaciones = () => { setShowNotificaciones((prev) => !prev); };

  const toggleNotificacionesUsuario = () => {
    setShowNotificacionesUsuario((prev) => !prev);
    if (!showNotificacionesUsuario) setMarkAsReadOnClose(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotificaciones && notificacionesRef.current && !notificacionesRef.current.contains(event.target) && !event.target.closest(".toggle-notificaciones-admin")) {
        setShowNotificaciones(false);
      }
      if (showNotificacionesUsuario && notificacionesUsuarioRef.current && !notificacionesUsuarioRef.current.contains(event.target) && !event.target.closest(".toggle-notificaciones-usuario")) {
        setShowNotificacionesUsuario(false);
      }
      if (dropdownOpen && !event.target.closest("#dropdownMenu") && !event.target.closest("#menuButton")) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, showNotificaciones, showNotificacionesUsuario]);

  useEffect(() => {
    if (markAsReadOnClose && !showNotificacionesUsuario) {
      const marcarNotificacionesComoLeidas = async () => {
        try {
          await fetch(`${API_BASE}/notificaciones/marcarLeidas`, { method: "PATCH" });
          setNotificacionesUsuario((prev) => prev.map((n) => ({ ...n, leida: true })));
          setMarkAsReadOnClose(false);
        } catch (error) {
          console.error("Error al marcar las notificaciones del usuario como leídas:", error);
        }
      };
      marcarNotificacionesComoLeidas();
    }
  }, [markAsReadOnClose, showNotificacionesUsuario]);

  const handleLogout = () => {
    const currentIsAdmin = isAdmin;
    logout("token");
    Swal.fire({
      title: "Sesión cerrada",
      text: "Has salido de tu cuenta correctamente.",
      icon: "success",
      background: "#fff1f2",
      color: "#540027",
      confirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      setIsLoggedIn(false);
      setIsAdmin(false);
      if (currentIsAdmin) router.push("/");
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      const obtenerNotificaciones = async () => {
        try {
          const response = await fetch(`${API_BASE}/notificaciones`);
          let data = await response.json();
          data = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          if (isAdmin) {
            setNotificaciones(data.filter((n) => !n.userId));
          } else {
            setNotificacionesUsuario(data.filter((n) => n.userId === userId));
          }
        } catch (error) {
          console.error("Error al obtener notificaciones:", error);
        }
      };
      obtenerNotificaciones();
    }
  }, [isLoggedIn, isAdmin, userId]);

  const handleDeleteNotificacion = async (id) => {
    try {
      await fetch(`${API_BASE}/notificaciones/${id}`, { method: "DELETE" });
      setNotificaciones((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error al borrar la notificación:", error);
    }
  };

  const handleDeleteNotificacionUsuario = async (id) => {
    try {
      await fetch(`${API_BASE}/notificaciones/${id}`, { method: "DELETE" });
      setNotificacionesUsuario((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error al borrar la notificación del usuario:", error);
    }
  };

  const unreadCount = notificaciones.filter((n) => !n.leida).length;
  const unreadCountUsuario = notificacionesUsuario.filter((n) => !n.leida).length;

  /* ── Shared pill-button style ──────────────────────────────── */
  const pillPrimary = {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 18px", borderRadius: "var(--r-pill)",
    background: "var(--burdeos)", color: "#fff",
    fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.875rem",
    border: "none", cursor: "pointer", textDecoration: "none",
    transition: "all 150ms",
    boxShadow: "var(--shadow-sm)",
  };
  const pillGhost = {
    ...pillPrimary,
    background: "transparent",
    color: "var(--burdeos)",
    border: "1.5px solid var(--border-strong)",
    boxShadow: "none",
  };
  const linkStyle = {
    color: "var(--burdeos)",
    fontFamily: "var(--font-nunito)", fontWeight: 600,
    fontSize: "0.875rem", textDecoration: "none",
    padding: "4px 2px",
    transition: "color 150ms",
  };

  return (
    <>
      {/* ── Top navbar ──────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full h-16 z-50 ${sofia.className}`}
        style={{
          background: "rgba(255,243,245,0.93)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div className="flex items-center justify-between h-full px-4 md:px-6 max-w-screen-2xl mx-auto">

          {/* ── Left: hamburger + logo ───────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              id="menuButton"
              className="flex md:hidden items-center justify-center rounded-xl p-1.5 transition-colors hover:bg-rosa-4"
              style={{ color: "var(--burdeos)" }}
              onClick={toggleDropdown}
              aria-label="Abrir menú"
            >
              <HamburgerIcon size={24} />
            </button>

            {/* Logo + brand name */}
            <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
              <div
                className="flex-shrink-0 overflow-hidden rounded-xl"
                style={{ width: 40, height: 40 }}
              >
                <Image
                  src="/img/logo.JPG"
                  width={40}
                  height={40}
                  alt="Logo Pastelería El Ruiseñor"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <div className="hidden md:block leading-none">
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "var(--font-nunito)",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Pastelería
                </div>
                <div
                  className={sofia.className}
                  style={{ fontSize: "1.35rem", color: "var(--burdeos)", lineHeight: 1.1 }}
                >
                  El Ruiseñor
                </div>
              </div>
            </Link>
          </div>

          {/* ── Right: nav actions ──────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* ── ADMIN logged in ─────────────────────────────── */}
            {isLoggedIn && isAdmin && (
              <div className="hidden md:flex items-center gap-3">
                <span
                  className="hidden lg:block text-sm font-semibold truncate max-w-[180px]"
                  style={{ color: "var(--text-soft)", fontFamily: "var(--font-nunito)" }}
                >
                  {userEmail}
                </span>
                {!asPath.startsWith("/dashboard") && (
                  <Link href="/dashboard">
                    <button style={pillGhost}>Dashboard</button>
                  </Link>
                )}
                <button style={pillPrimary} onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}

            {/* ── USER logged in (not admin) ───────────────────── */}
            {isLoggedIn && !isAdmin && (
              <div className="hidden md:flex items-center gap-3">
                <span
                  className="hidden lg:block text-sm font-semibold truncate max-w-[160px]"
                  style={{ color: "var(--text-soft)", fontFamily: "var(--font-nunito)" }}
                >
                  {userEmail}
                </span>
                <Link href="/enduser/mispedidos" style={linkStyle}>Mis Pedidos</Link>
                <Link href="/cotizacion">
                  <button style={dropdownOpen ? { ...pillPrimary, display: "none" } : pillPrimary}>
                    ¡Cotizar ahora!
                  </button>
                </Link>
                <button style={pillGhost} onClick={handleLogout}>Salir</button>

                {/* Cart */}
                <Link href="/enduser/carrito">
                  <button
                    className="flex items-center gap-1 rounded-xl px-2 py-1.5 transition-colors hover:bg-rosa-4"
                    style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)", fontWeight: 700, fontSize: "0.8rem" }}
                  >
                    <CartIcon size={20} />
                    {productsCount > 0 && (
                      <span
                        className="flex items-center justify-center rounded-full text-xs font-bold"
                        style={{ minWidth: 18, height: 18, background: "var(--rosa)", color: "#fff", padding: "0 4px" }}
                      >
                        {productsCount}
                      </span>
                    )}
                  </button>
                </Link>

                {/* Help */}
                <Link href="/enduser/conocenos#preguntasfrecuentes">
                  <button
                    className="hidden lg:flex items-center justify-center rounded-xl p-1.5 transition-colors hover:bg-rosa-4"
                    style={{ color: "var(--burdeos)" }}
                    aria-label="Preguntas frecuentes"
                  >
                    <HelpIcon size={20} />
                  </button>
                </Link>
              </div>
            )}

            {/* ── GUEST (not logged in) ────────────────────────── */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/registrarse" style={linkStyle}>Registrarse</Link>
                <Link href="/enduser/conocenuestrosproductos" style={linkStyle}>Productos</Link>
                <Link href="/enduser/galeria" className="hidden lg:inline" style={linkStyle}>Galería</Link>
                <Link href="/login" style={linkStyle}>Iniciar sesión</Link>
                <Link href="/enduser/conocenos#preguntasfrecuentes">
                  <button
                    className="hidden lg:flex items-center justify-center rounded-xl p-1.5 transition-colors hover:bg-rosa-4"
                    style={{ color: "var(--burdeos)" }}
                    aria-label="Preguntas frecuentes"
                  >
                    <HelpIcon size={20} />
                  </button>
                </Link>
                <Link href="/cotizacion">
                  <button style={dropdownOpen ? { ...pillPrimary, display: "none" } : pillPrimary}>
                    ¡Cotizar ahora!
                  </button>
                </Link>
              </div>
            )}

            {/* ── Bell: ADMIN notifications ────────────────────── */}
            {isLoggedIn && isAdmin && (
              <div className="relative">
                <button
                  className="toggle-notificaciones-admin relative flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-rosa-4"
                  style={{ color: "var(--burdeos)" }}
                  onClick={toggleNotificaciones}
                  aria-label="Notificaciones"
                >
                  <BellIcon size={22} />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1 right-1 flex items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        minWidth: 16, height: 16,
                        background: "#22c55e", color: "#fff",
                        padding: "0 3px", fontSize: "0.65rem",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotificaciones && (
                  <NotificationDropdown
                    notifications={notificaciones}
                    onDelete={handleDeleteNotificacion}
                    linkHref="/dashboard/cotizaciones"
                    innerRef={notificacionesRef}
                  />
                )}
              </div>
            )}

            {/* ── Bell: USER notifications ─────────────────────── */}
            {isLoggedIn && !isAdmin && (
              <div className="relative">
                <button
                  className="toggle-notificaciones-usuario relative flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-rosa-4"
                  style={{ color: "var(--burdeos)" }}
                  onClick={toggleNotificacionesUsuario}
                  aria-label="Notificaciones"
                >
                  <BellIcon size={22} />
                  {unreadCountUsuario > 0 && (
                    <span
                      className="absolute top-1 right-1 flex items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        minWidth: 16, height: 16,
                        background: "#22c55e", color: "#fff",
                        padding: "0 3px", fontSize: "0.65rem",
                        fontFamily: "var(--font-nunito)",
                      }}
                    >
                      {unreadCountUsuario}
                    </span>
                  )}
                </button>
                {showNotificacionesUsuario && (
                  <NotificationDropdown
                    notifications={notificacionesUsuario}
                    onDelete={handleDeleteNotificacionUsuario}
                    linkHref="/enduser/mispedidos"
                    innerRef={notificacionesUsuarioRef}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      {dropdownOpen && (
        <div
          id="dropdownMenu"
          className="fixed inset-0 z-[60] flex md:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(84,0,39,0.35)", backdropFilter: "blur(4px)" }}
            onClick={closeDropdown}
          />

          {/* Drawer panel */}
          <div
            className="relative flex flex-col w-[85%] max-w-xs h-full overflow-y-auto"
            style={{ background: "var(--crema)", boxShadow: "var(--shadow-xl)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center gap-2">
                <div className="rounded-xl overflow-hidden" style={{ width: 36, height: 36 }}>
                  <Image src="/img/logo.JPG" width={36} height={36} alt="Logo" style={{ objectFit: "cover" }} />
                </div>
                <span className={`${sofia.className} text-xl`} style={{ color: "var(--burdeos)" }}>
                  El Ruiseñor
                </span>
              </div>
              <button
                onClick={closeDropdown}
                className="rounded-xl p-1.5 transition-colors hover:bg-rosa-4"
                style={{ color: "var(--burdeos)" }}
                aria-label="Cerrar menú"
              >
                <CloseIcon size={22} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-1 px-4 py-5 flex-1">
              {isLoggedIn ? (
                isAdmin ? (
                  <>
                    <div
                      className="px-3 py-2 text-sm font-semibold truncate"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-nunito)" }}
                    >
                      {userEmail}
                    </div>
                    <button
                      onClick={() => { handleNavigation(); closeDropdown(); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold transition-colors hover:bg-rosa-4 text-left"
                      style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)" }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold transition-colors hover:bg-rosa-4 text-left"
                      style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)" }}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="px-3 py-2 text-sm font-semibold truncate"
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-nunito)" }}
                    >
                      {userEmail}
                    </div>
                    {[
                      { href: "/enduser/conocenuestrosproductos", label: "Productos" },
                      { href: "/enduser/galeria", label: "Galería" },
                      { href: "/enduser/mispedidos", label: "Mis Pedidos" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeDropdown}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold transition-colors hover:bg-rosa-4"
                        style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)", textDecoration: "none" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold transition-colors hover:bg-rosa-4 text-left"
                      style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)" }}
                    >
                      Cerrar sesión
                    </button>
                    <div className="mt-4">
                      <Link href="/cotizacion" onClick={closeDropdown}>
                        <button style={{ ...pillPrimary, width: "100%", justifyContent: "center", padding: "12px 18px" }}>
                          ¡Cotizar ahora!
                        </button>
                      </Link>
                    </div>
                    {/* Cart + Help row */}
                    <div className="flex items-center gap-3 mt-3 px-3">
                      <Link href="/enduser/carrito" onClick={closeDropdown}>
                        <button
                          className="flex items-center gap-1.5 rounded-xl px-3 py-2 font-bold text-sm transition-colors hover:bg-rosa-4"
                          style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)", border: "1.5px solid var(--border-strong)" }}
                        >
                          <CartIcon size={18} />
                          Carrito ({productsCount})
                        </button>
                      </Link>
                      <Link href="/enduser/conocenos#preguntasfrecuentes" onClick={closeDropdown}>
                        <button
                          className="flex items-center justify-center rounded-xl p-2 transition-colors hover:bg-rosa-4"
                          style={{ color: "var(--burdeos)", border: "1.5px solid var(--border-strong)" }}
                          aria-label="Preguntas frecuentes"
                        >
                          <HelpIcon size={18} />
                        </button>
                      </Link>
                    </div>
                  </>
                )
              ) : (
                <>
                  {[
                    { href: "/registrarse", label: "Registrarse" },
                    { href: "/enduser/conocenuestrosproductos", label: "Productos" },
                    { href: "/enduser/galeria", label: "Galería" },
                    { href: "/login", label: "Iniciar sesión" },
                    { href: "/enduser/conocenos#preguntasfrecuentes", label: "Preguntas frecuentes" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDropdown}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-bold transition-colors hover:bg-rosa-4"
                      style={{ color: "var(--burdeos)", fontFamily: "var(--font-nunito)", textDecoration: "none" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Link href="/cotizacion" onClick={closeDropdown}>
                      <button style={{ ...pillPrimary, width: "100%", justifyContent: "center", padding: "12px 18px" }}>
                        ¡Cotizar ahora!
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Footer decoration */}
            <div
              className="px-5 py-4 text-xs"
              style={{
                borderTop: "1px solid var(--border-color)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-nunito)",
              }}
            >
              Pastelería El Ruiseñor · CDMX
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarAdmin;
