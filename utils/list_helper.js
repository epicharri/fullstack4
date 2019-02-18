const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const summa = (total, number) => {
    return total + number
  }

  return blogs.map(
    blog => blog.likes
  ).reduce(
    summa, 0
  )
}

module.exports = {
  dummy,
  totalLikes
}
