import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import Moment from 'react-moment'

import { useUpdateShowNav } from 'components/context/ShowNavContext'
import { cvtRecipeUrl } from 'functions/upload/convertImageUrl'
import { RecipeContent } from 'interfaces/Recipe'
// import styles from 'styles/Test.module.css'
import bStyles from 'styles/Button.module.css'
import tStyles from 'styles/Text.module.css'
import lStyles from 'styles/Layout.module.css'

const Print: FC<{ recipes: RecipeContent[] }> = ({ recipes }) => {
  const router = useRouter()
  const updateShowNav = useUpdateShowNav()

  // 上部のナビゲーションをオフにする
  useEffect(() => {
    updateShowNav(false)
  }, [])

  return (
    <>
      <div className='container'>
        <input
          className={`${bStyles.btn} ${bStyles.btnSBlack} no_print printBtn`}
          type='button'
          value='印刷する'
          onClick={() => window.print()}
        />
        <div className='cotnentWrap'>
          <div className='box'>
            <div className='wrap'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe enim voluptates illum. Ipsam corporis hic
              officia, reprehenderit corrupti non rerum exercitationem provident accusantium. Tempora, dignissimos
              soluta iste vero eum voluptate.
            </div>
          </div>
          <div className='box'>
            <div className='wrap'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae maxime adipisci tempora? Dolore
              inventore, quae asperiores id deleniti, quas sed sint voluptatibus minus beatae, reiciendis nostrum saepe
              quisquam natus. Quis? Nostrum optio similique sapiente commodi impedit tempore placeat voluptates
              inventore illo molestias consectetur voluptate voluptatibus delectus cupiditate ad ipsa aliquid deleniti
              aspernatur temporibus, aliquam ducimus. Dolorum sit voluptatibus quia nihil! Dolores ex voluptatem
              aspernatur esse quod magnam error qui consequatur nisi, reiciendis eveniet debitis rem cum iste porro
              labore repellat inventore. Maiores sed eos incidunt aspernatur cupiditate laborum cumque! Commodi. Sint i
              culpa, non ea velit maxime aliquid odit expedita doloremque magni deserunt ut molestias quibusdam
              explicabo dolores mollitia ad ex dolorem tempore nihil. Cumque, architecto. Nisi sint voluptatem
              perferendis illo cupiditate fuga qui excepturi voluptatibus! Id vel repudiandae fuga quia? Obcaecati
              voluptas qui non sed nesciunt accusantium ipsum id tempore? Nam harum accusamus at recusandae. Totam
              consectetur quibusdam voluptatum porro rem labore, saepe maxime, optio ea aut, quis possimus? Fuga
              dignissimos alias ex maiores dolore! Vero necessitatibus ab impedit ullam. Distinctio officiis velit sit?
              Corporis. Est blanditiis perferendis ullam rerum nulla maiores dolorum possimus. Laudantium asperiores
              vero sequi quidem accusantium, iusto assumenda fuga sunt minima perspiciatis vel error praesentium,
              nostrum quas cum. Delectus, fuga repudiandae. Labore, odio ullam neque quos reiciendis beatae dolores
              totam qui, voluptatum earum molestias consequuntur ipsam, ad minima repellendus illum dolorum suscipit
              maiores dolorem sequi temporibus dolor porro hic possimus? Animi? Ullam debitis repudiandae animi suscipit
              distinctio, maiores alias. In officiis at exercitationem itaque quasi, repellendus perspiciatis.
              Blanditiis accusamus voluptatibus numquam nam, autem amet a dicta, eveniet necessitatibus nisi eum porro.
              Impedit perspiciatis necessitatibus provident totam earum. Quaerat fuga repudiandae ipsam vel voluptas
              dolorum aperiam unde, nam vero asperiores incidunt iusto provident sint. Deleniti ea itaque consequatur
              vitae earum culpa libero? Nobis aut officiis maxime autem recusandae modi laborum, necessitatibus cumque,
              cum esse aperiam excepturi tempore ipsam natus. Esse dolor saepe numquam fugiat modi. Veritatis, nobis
              iste est voluptates aperiam laborum. Excepturi quas ipsum error aliquid, quis eos ratione unde. Aspernatur
              quos consequatur unde voluptatibus! Facilis dolorem quo, possimus culpa voluptate, optio similique,
              reiciendis sequi quis accusamus perspiciatis itaque non atque? Cum molestias tempore quo libero
              consequatur accusantium quaerat eveniet voluptatibus tenetur, consequuntur recusandae velit illo dicta
              distinctio repudiandae neque nobis quae exercitationem. Harum nostrum iusto, qui aliquid ipsam recusandae
              neque. Nemo expedita fugiat corporis esse. Deserunt laudantium ipsum at sed voluptatibus qui consectetur,
              consequatur distinctio magni eius voluptatum vero aliquid asperiores voluptates sapiente porro beatae
              saepe quis sunt recusandae? Excepturi? Et voluptas unde veniam tenetur quibusdam assumenda iste illum
              cupiditate, dolorum eveniet animi quae consequuntur. Aut debitis ipsum, dolorem odit voluptatibus
              asperiores inventore tempore, ad sequi maxime dolorum neque saepe. Dicta reprehenderit quas facere ea
              veniam repellendus inventore, eius incidunt magnam, pariatur ipsum, doloribus harum delectus ad commodi
              ipsa repellat? Pariatur ducimus alias laborum aspernatur cum, nobis eos quidem numquam? Consequuntur
              veniam quam soluta iusto iste similique modi. Odit cum, veritatis assumenda obcaecati ea vero dolor rem
              amet sint explicabo aperiam error, nihil possimus eligendi! Ad aliquam quasi illum voluptatibus!
              Reprehenderit dolorem voluptate a atque eius inventore perspiciatis beatae ab molestias, sunt ullam
              tenetur itaque obcaecati cum iste accusamus porro consequuntur ratione aut ad consequatur. Ex magnam sit
              animi dolore! Minus dolorum sapiente excepturi debitis nihil praesentium, natus consequatur unde eos optio
              aspernatur dolore aut ea, quia modi quas hic quis. Error autem similique molestias accusamus quisquam, non
              harum dolorum. Illo tempore placeat nemo nulla, non animi aliquid. Aut neque autem quod ratione animi
              culpa laborum omnis eum similique repellendus sed, aliquid accusantium at asperiores perspiciatis facilis
              assumenda earum eos! Consectetur, laborum illum minus voluptate pariatur et alias magnam voluptates maxime
              commodi, harum placeat quia a quo. Id distinctio quas perspiciatis pariatur enim, repellat iure,
              perferendis reiciendis totam quaerat numquam. Odio quod veritatis blanditiis optio placeat similique
              consequatur, maiores dolores animi adipisci laudantium praesentium ex atque inventore modi tempore
              necessitatibus aliquam sequi non minus natus illum dignissimos quia nulla? Repellat. Delectus eaque
              tempora iste ipsum? Officia, ea hic eveniet fuga ex atque, quasi reiciendis eum, consectetur a explicabo!
              Suscipit ipsum animi blanditiis in minima, ipsa voluptatum voluptas voluptatem consectetur quaerat! Quis
              molestiae quisquam impedit, necessitatibus laboriosam incidunt sed maxime magnam numquam sapiente minima
              doloribus soluta cumque repudiandae nulla aspernatur nesciunt hic ad facere cupiditate deserunt atque?
              Labore eos expedita maiores. Incidunt ipsam dolor a dignissimos ratione officia, accusamus, necessitatibus
              magnam cumque ullam laboriosam aperiam. Expedita repellendus ullam eum, illum odio deserunt tempora
              explicabo nobis similique sint, ex cum. Eaque, quisquam? Pariatur tempore, quasi nihil inventore sed quas
              maiores? Animi amet quasi officiis numquam molestiae iusto iste reprehenderit aut quibusdam cupiditate
              autem maiores iure ex necessitatibus veniam, debitis quos illo mollitia! Consequatur laborum itaque,
              tenetur libero a sit provident ratione pariatur, deserunt consectetur commodi labore adipisci autem
              corrupti dicta repellendus ipsam dolore cumque, incidunt saepe quae numquam. Maiores, debitis? Molestias,
              voluptatem. Molestiae in commodi error quod excepturi maiores repellat quidem, officia aliquid voluptates
              autem? Quia, eligendi nisi voluptate reprehenderit aut inventore labore suscipit voluptatem nulla sequi
              ratione deserunt repellendus cupiditate harum. Obcaecati omnis ex corporis magni ut soluta nulla aliquam
              provident consectetur placeat, dolores itaque assumenda cum quo dolorum! Exercitationem dicta eligendi
              quasi sunt incidunt excepturi veritatis accusantium, est numquam distinctio. Sint veniam, aspernatur eius
              dolores molestias facilis quis id ea sed commodi maxime omnis nam repellendus magni nobis labore unde
              necessitatibus non aut voluptas laborum similique beatae ad fuga? Veniam. Ullam porro ab vel laborum
              dolore nisi quisquam repellendus, magnam possimus! Minus repudiandae odio, temporibus veniam hic tempora!
              Consectetur reiciendis, aut recusandae aliquam error quas numquam! Voluptatem illo voluptatibus
              voluptatum? Eveniet quia deserunt amet saepe earum est voluptates cupiditate, expedita, debitis, provident
              odit aliquam dignissimos voluptatum! Ut molestias, mollitia minima obcaecati commodi amet aperiam. Nobis
              corporis error quasi voluptas nulla. Neque, itaque fuga unde accusantium adipisci eveniet rerum iste
              deleniti assumenda mollitia! Itaque rem aspernatur nulla debitis voluptates atque, repellendus nihil velit
              ut aliquid accusamus vel voluptas vero doloremque suscipit. Mollitia odit error reiciendis voluptas
              dignissimos, debitis exercitationem repellat enim eius quam, quae itaque libero culpa, non et earum minus
              magni dicta molestiae quibusdam provident numquam perferendis. Neque, voluptatum ipsam? Earum dolor quidem
              beatae exercitationem accusantium ex, reiciendis consequuntur laudantium cumque quod fugit ratione dolore
              consequatur accusamus eaque velit voluptates? Iste ea eos voluptates placeat veritatis cupiditate eaque
              aperiam tenetur. Laborum pariatur neque veritatis, necessitatibus enim suscipit vitae ipsam consequatur
              labore asperiores dolore nemo consectetur nihil unde nulla repellat temporibus quod culpa sit excepturi
              distinctio! Quidem illo animi deleniti quam. Possimus dignissimos a, aperiam tempore nemo cum eaque beatae
              blanditiis, excepturi dolores tempora autem quam dicta cumque. Exercitationem, corporis. Illum saepe velit
              consequuntur maxime deserunt consequatur, recusandae quaerat qui tenetur. Animi necessitatibus laudantium
              similique unde! Inventore est autem numquam maiores earum distinctio blanditiis harum cum quibusdam beatae
              porro id dolores quod animi hic ad quidem, dolorum perferendis nemo, doloribus quae. Provident, quisquam?
              Eum, quasi cumque quo neque ea, illo at autem aspernatur ipsum pariatur a. Illo odio minus ab modi nostrum
              voluptatibus ipsum, reiciendis voluptatem, laborum accusantium, quaerat enim harum. Cupiditate eum atque
              ipsa eligendi nesciunt aperiam expedita, sunt odio laudantium quam ut voluptate placeat quidem vitae
              mollitia illo suscipit perferendis repudiandae voluptatum blanditiis voluptas veritatis, quasi nulla!
              Possimus, laborum. Adipisci possimus dolores ad quam ratione consequuntur rerum id accusamus, soluta
              repudiandae maxime cupiditate. Sequi fugit, nemo non perspiciatis eveniet, aperiam commodi repellendus
              illo quasi ullam minus quae nobis? Quasi. Molestiae commodi at soluta praesentium maiores obcaecati cumque
              dolorem odio iste unde quasi, eveniet magnam, quia dolor mollitia ad expedita eius doloremque ullam beatae
              impedit reprehenderit cum atque? Nam, aspernatur. Quasi veniam minus veritatis nostrum voluptas in is?
              Quis laudantium iusto fuga nemo ad unde temporibus amet reprehenderit, saepe provident nisi natus earum
              qui enim explicabo pariatur dicta? Pariatur, suscipit! Id impedit unde reiciendis. Modi nihil voluptas
              molestias enim recusandae sit molestiae libero saepe cumque voluptatem fuga animi, nemo, ab amet
              voluptatibus tempora illum eveniet minima veritatis minus consequatur. Consequatur recusandae commodi
              neque voluptatum.
            </div>
          </div>
          <div className='box'>
            <div className='wrap'>CCCCCCCCC</div>
          </div>
          <div className='box'>
            <div className='wrap'>DDDDDDDDD</div>
          </div>
        </div>
      </div>

      <style>{`
        @page {
          size: A4 portrait;
          margin: 0mm;
          /* border: 1px solid gray; */
        }
        
        .container {
          margin: auto;
          display: flex;
          flex-direction: column;
          width: 210mm;
          height: 297mm;
          box-sizing: border-box;
          /* padding: 0 20mm; */
        }
        
        .contentWrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .box {
          display: flex;
          flex-direction: column;
          width: 208mm;
          height: 295mm;
          /* width: 100%; */
          page-break-after: always;
          /* margin-top: 50px; */
        }
        
        .box:nth-child(odd) {
          border-right: 2px solid red;
        }
        .box:nth-child(1),
        .box:nth-child(2) {
          border-bottom: 2px solid blue;
        }
        
        .hr {
          break-after: always;
        }
        
        @media print {
          .no_print {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default Print
