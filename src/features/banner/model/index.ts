import { ref } from 'vue'
import { Autoplay, Pagination } from 'swiper/modules'

export const useBanner = () => {
  const modules = ref([Autoplay, Pagination])

  return {
    modules,
  }
}
