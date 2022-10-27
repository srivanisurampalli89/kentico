import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import getConfig from 'next/config'
import Head from 'next/head'
import Image from 'next/image'
import {createDeliveryClient} from '@kentico/kontent-delivery'
import Link from 'next/link'
import Schedule from 'react-schedule-job'
import KontentService from '../services/KontentService'
import PreviewModeBanner, {
    PreviewModeData,
    PreviewModeProps,
} from '../components/PreviewModeBanner'
import ClientOnly from '../components/clientOnly'
import Search from '../components/search'
import CardBlock from '../components/CardBlock'
import Spinner from '../components/Spinner'
import {
    renderHtml,
    jobs,
} from '../components'

const DefaultPage = (props) => {
    const [query, setQuery] = useState('')
    const [subPages, setSubPages] = useState<any>([])
    const [loader, setLoader] = useState(true)
    const [url, setUrl] = useState('/')
    const [pageName, setPageName] = useState('')
    const router = useRouter()
    // const [contents, setContents] = useState<any>([])
    // const [flag, setFlag] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo(0, 0)
        }
    }, [router, (typeof window !== 'undefined' && window.location.hash)])

    useEffect(() => {
        // eslint-disable-next-line no-use-before-define
        if (url === '/') {
            setLoader(false)
        }
 console.log("testing")
        // eslint-disable-next-line no-use-before-define
        getElements().then((res) => {
            const item = res && [{...res.data.items[0]}]
            if (item && item.length && item[0] !== undefined) {
                setSubPages(item[0].elements)
                setPageName(item[0]?.system?.name)
            }

            setLoader(true)
        })

        setUrl(props.kontent.pageSlug)
    }, [props.kontent && props.kontent.pageSlug])

    const kontentProps = props.kontent
    const applicationProps = new KontentService().getApplicationProps(router)
    const previewModeProps = {
        isInPreviewMode: props.isInPreviewMode,
        previewData: props.previewData,
    }

    const getElements = async () => {
        const {KONTENT_PROJECT_ID} = getConfig().publicRuntimeConfig
        const {KONTENT_PREVIEW_API_KEY} = getConfig().publicRuntimeConfig
        let info = null
        const deliveryClient = createDeliveryClient({
            projectId: KONTENT_PROJECT_ID,
            previewApiKey: KONTENT_PREVIEW_API_KEY,
            defaultQueryConfig: {
                usePreviewMode: true,
            },
        })
        if (props.kontent && props.kontent.pageSlug !== '/') {
            const pageUrl = `/${props.kontent.pageSlug.split('/')[1]}`
            info = await deliveryClient.items().equalsFilter('elements.page_url', pageUrl).depthParameter(50).toPromise()
            getLatestDate(info)
        } else {
            setSubPages([])
            setLoader(true)
        }
        return info
    }

    const blockinfo = () => props.kontent.blocks
        .filter((item) => item.type === 'row')
        .map((ele) => ele.items)

    const getSearchQuery = (value) => {
        setQuery(value)
    }

    const rendernav = (items) => {
        const ele = items.map((item) => (
            <>
                {item?.elements?.subpages?.value.length > 0 ? (
                    <FaqItem title={<div className={router.asPath === item.elements.page_url.value ? 'text-sm font-sans font-[0.875rem] text-[#3482F6] leading-none hover:underline hover:text-[#3482F6] mb-3' : 'text-sm font-sans font-[0.875rem] leading-none hover:underline hover:text-[#3482F6] mb-3'}><Link href={item.elements.page_url.value} as={`${item.elements.page_url.value}`} scroll={false}><a className="font-normal">{item.elements.page_text.value}</a></Link></div>}>{
                        rendernav(item.elements.subpages.linkedItems)
                    }
                    </FaqItem>
                ) : (
                    <div className={router.asPath === item.elements.page_url.value ? 'pl-4 text-sm font-sans text-[#3482F6] leading-none hover:underline hover:text-[#3482F6] mb-3' : 'pl-4 text-sm font-sans leading-none hover:underline hover:text-[#3482F6] mb-3'}>
                        <Link href={item.elements.page_url.value} as={`${item.elements.page_url.value}`}><a>{item.elements.page_text.value}</a></Link>
                    </div>
                )}
            </>
        ))
        return ele
    }

    const getRenderBlocks = () => {
        let updateBlocks = props.kontent.blocks.map((item) => {
            if (item && item.type === 'rich_text') {
                // eslint-disable-next-line no-param-reassign
                item.content = renderHtml(item) // <Content data={item} />
            }
            return item
        })
        updateBlocks = updateBlocks.filter((item) => item.type !== 'image')
        return updateBlocks
    }

    const renderContent = () => {
        if (router.query.slug && (query === '' && router.query.q === undefined)) {
            const pageImages = props.kontent.blocks.filter((ele) => ele.image !== undefined)
            let img1 = null
            if (pageImages && pageImages[0] && pageImages[0].image[0] && pageImages[0].image[0].url !== undefined) {
                img1 = pageImages[0].image[0].url
            }
            return (
                <>
                    {loader ? (
                        <div className="flex flex-row justify-start items-start">
                            {subPages?.subpages?.value?.length > 0 ? (
                                <div className="sticky mt-6 w-96 h-96 top-40 overflow-auto">
                                   \
                                        {img1 && <Image src={img1} alt="" width="120px" height="60px" />}
                                        <h5 className="mt-4">{pageName}</h5>
                                        <div className="h-1 w-full bg-gray-600 lg:w-2/3 mt-2 mb-3"> </div>
                                        {subPages?.subpages?.value.length > 0 ? rendernav(subPages.subpages.linkedItems) : ('')}
                                    
                                </div>
                            ) : ''}
                            <div className="w-full pb-[5%]">
                                <BlockMapper
                                    blocks={getRenderBlocks()}
                                    applicationProps={applicationProps}
                                   
                                />
                            </div>
                        </div>
                    ) : (<div className="ml-auto mr-auto block align-center"><Spinner /></div>)}
                </>
            )
        }

        if (!router.query.q && !query) {
            return <CardBlock data={blockinfo()} />
        }
        return null
    }

    return (
        <ClientOnly>
            <div>
                <Head>
                    <title>{`${kontentProps?.pageTitle}`}</title>
                </Head>
                <PreviewModeBanner {...previewModeProps} />
                <Search getSearchQuery={getSearchQuery} />
                {renderContent()}
            </div>

            <Schedule
                jobs={jobs}
                timeZone="UTC"
                dashboard={{hidden: true}}
            />
        </ClientOnly>
    )
}

export const getServerSideProps = async (
    context,
) => {
    const kontentService = new KontentService()
    const kontent = await kontentService.getKontentForRequest(context)

    const isInPreviewMode = context.preview ?? false
    const previewData = (context.previewData) ?? {}
    const isNotFound = kontent?.blocks?.length === 0
    if (isNotFound) {
        return {notFound: true, props: {kontent, isInPreviewMode, previewData}}
    }

    return {props: {kontent, isInPreviewMode, previewData}}
}

export default DefaultPage