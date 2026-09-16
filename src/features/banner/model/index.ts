import { reactive, ref } from 'vue'
import { Autoplay, Pagination } from 'swiper/modules'

export const useBanner = () => {
  const modules = ref([Autoplay, Pagination])

  const bannercontent = reactive([
    {
      contentType: 'URL',
      link: 'https://www.youtube.com/live/z60KbxZgcBs?si=ZflDbQoTxOBM8Csz&t=2598',
      previewImage:
        'https://i9.ytimg.com/vi/z60KbxZgcBs/maxresdefault.jpg?v=6aa82903&sqp=CMT6qNUG&rs=AOn4CLAUIt0SewCqMaN7DAE6lI992lwulA',
    },
    {
      contentType: 'URL',
      link: 'https://www.youtube.com/live/vsqPCNYcJ50?si=PusLYrQ8U5MxOrli&t=2517',
      previewImage:
        'https://i9.ytimg.com/vi/vsqPCNYcJ50/maxresdefault.jpg?v=6aa2e192&sqp=CMiBqdUG&rs=AOn4CLB6mHNHu82eOUQsbCYHecHDz0ceWw',
    },
    {
      contentType: 'URL',
      link: 'https://www.youtube.com/live/fxbA1RjEd3M?si=D9gws2Rrk-tksqaC&t=3355',
      previewImage:
        'https://i9.ytimg.com/vi/fxbA1RjEd3M/maxresdefault.jpg?v=6a9ee889&sqp=CMiBqdUG&rs=AOn4CLCMpI5twXyOKfzRICxcFKlNUyoqeQ',
    },
  ])

  return {
    modules,
    bannercontent,
  }
}
