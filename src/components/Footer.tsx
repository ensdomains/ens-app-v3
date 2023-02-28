export const Footer = () => {
  const headerHeight =
    typeof window !== 'undefined'
      ? document.getElementsByClassName('header')[0].getBoundingClientRect().height
      : 72

  return <div style={{ height: headerHeight }} />
}
