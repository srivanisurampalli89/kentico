import KontentDelivery from '@kentico/kontent-delivery'

import KontentSmartLink from '@kentico/kontent-smart-link'


export default class KontentService {
     SUPPORTED_TYPES = ['page']

    initializeKontentSpotlight = (locale) =>  {
        const smartLink = KontentSmartLink.initialize({
            defaultDataAttributes: {
                projectId: process.env.KONTENT_PROJECT_ID,
                languageCodename: locale,
            },
            queryParam: 'preview-mode',
        })
        return(smartLink.destroy())  
    }

    getApplicationProps(router) {
        const applicationProps = {
            routerPath: router.asPath,
            routerNavigateToPath: (path) => { router.push(path) },
        }
        return applicationProps
    }

    async getKontentForRequest(context) {
        const isPreviewMode = context.preview ?? false
        const kontentService = new KontentDelivery(process.env.KONTENT_PROJECT_ID ?? '', process.env.KONTENT_PREVIEW_API_KEY ?? '', isPreviewMode)
        const requestParams = context?.params?.slug 
        const rawSlug = requestParams || []
        const slug = `/${rawSlug?.join('/')}`

        const pageContentItem = await kontentService.getContentItem(slug, this.SUPPORTED_TYPES, 'default')
        return pageContentItem
    }

    async getKontentItemsByType(props) {
        const {
            codename,
            isPreviewMode = false,
            locale = 'default',
            skipIfUnset,
            skipItems,
            pageLength,
            pageNumber,
            taxonomyCodename,
            depth,
        } = props

        const kontentService = new KontentDelivery(
            process.env.KONTENT_PROJECT_ID ?? process.env.REACT_APP_KONTENT_PROJECT_ID ?? '',
            process.env.KONTENT_PREVIEW_API_KEY ?? '',
            isPreviewMode,
        )

        const apiProps = {locale, codename, skipIfUnset, pageNumber, taxonomyCodename, pageLength, skipItems, depth}

        const items = await kontentService.getFilteredAndPagedItemsByCodename(apiProps)
        if (items.length === 0) return null
        return items;
    }
}