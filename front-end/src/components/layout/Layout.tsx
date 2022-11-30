import Nav from 'components/nav/Nav'
import Info from 'components/nav/Info'

const Layout = ({ children }: { children: React.ReactNode }, { data }: any) => {
  return (
    <>
      <Info />
      <Nav />
      {children}
    </>
  )
}

export default Layout
