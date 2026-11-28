/* =========================================================
   CONDITIONS GÉNÉRALES — FR / EN / AR
   ⚠️ Modèle de départ : à relire (et idéalement faire valider par un juriste)
   avant d'accepter des clients. Changez les chiffres (acompte, délais, retouches)
   selon votre façon de travailler.
   ========================================================= */
const TERMS = {
  fr: {
    title: "Conditions générales de prestation",
    updated: "Dernière mise à jour : novembre 2026",
    intro: "Ces conditions s'appliquent à toute commande passée auprès de STUDIO·IA (le « Studio ») par un client professionnel ou particulier (le « Client »). Toute commande, y compris par WhatsApp, vaut acceptation de ces conditions.",
    items: [
      ["1. Le service", "Le Studio crée des photos et des vidéos publicitaires à l'aide d'outils d'intelligence artificielle : mannequins virtuels, décors et mises en scène générés numériquement. Aucun shooting réel n'a lieu. Les mannequins sont des personnages créés par IA et ne représentent aucune personne réelle."],
      ["2. Commande, aperçu et devis", "Le Client choisit sur le site un mannequin, un lieu, un format et un pack, puis envoie sa demande. Le Studio lui envoie d'abord un aperçu gratuit (un visuel en basse définition, avec filigrane) pour valider le mannequin, le lieu et le rendu. Après validation, un devis écrit (WhatsApp ou e-mail) précise le contenu, le prix et le délai. La commande est confirmée à la réception de l'acompte."],
      ["3. Prix et paiement", "Les prix sont indiqués en dinars algériens (DA). Un acompte de 50 % est demandé à la commande ; le solde est payé à la livraison des fichiers finaux, avant leur envoi en haute définition. Les packs mensuels sont payables d'avance."],
      ["4. Ce que le Client fournit", "Le Client envoie des photos claires de son produit (plusieurs angles, bonne lumière) et toutes les informations utiles (couleurs, tailles, logo). Il garantit être propriétaire du produit ou autorisé à le promouvoir, et détenir les droits sur les logos et marques fournis."],
      ["5. Délais", "Le délai indiqué dans le devis court à partir de la réception de l'acompte et de tous les éléments du Client. Un retard dans l'envoi des éléments ou dans les validations décale la livraison d'autant."],
      ["6. Retouches", "Chaque commande comprend 2 séries de retouches gratuites dans les 7 jours suivant la livraison de l'aperçu. Les demandes qui changent la commande (autre mannequin, autre lieu, autre format) sont facturées comme une nouvelle création."],
      ["7. Garantie fidélité", "Si un visuel livré n'est pas fidèle au produit réel (couleur, coupe, détails visibles sur les photos fournies), le Studio le refait gratuitement. La garantie s'applique quand le Client a fourni des photos nettes du produit (face, dos et détails) et signale l'écart dans les 7 jours suivant la livraison."],
      ["8. Égérie exclusive (option)", "Sur demande, le Client peut réserver un mannequin en exclusivité pendant 6 ou 12 mois à partir de la confirmation de la commande. Pendant cette période, le Studio ne propose pas ce mannequin à une autre marque de la même catégorie de produits. Le prix de l'option est indiqué dans le devis."],
      ["9. Droits d'utilisation", "Après paiement complet, le Client peut utiliser librement les visuels livrés pour promouvoir son produit (site, réseaux sociaux, publicité, impression), sans limite de durée. Le Studio peut montrer les réalisations dans son portfolio, sauf demande écrite contraire du Client."],
      ["10. Transparence IA", "Les visuels sont générés par intelligence artificielle. Certaines plateformes demandent de le signaler : il appartient au Client de respecter les règles des plateformes où il publie. Le rendu peut présenter de légères différences avec le produit réel ; le Studio s'efforce de rester fidèle aux couleurs et aux détails."],
      ["11. Contenus refusés", "Le Studio refuse toute demande illégale, trompeuse ou contraire aux bonnes mœurs, ainsi que toute imitation d'une personne réelle ou d'une marque dont le Client n'est pas titulaire."],
      ["12. Annulation et remboursement", "Avant le début de la création, le Client peut annuler et récupérer son acompte, moins les frais déjà engagés. Une fois la création commencée, l'acompte reste acquis au Studio. Aucun remboursement après la livraison des fichiers finaux."],
      ["13. Confidentialité", "Les photos et informations du Client servent uniquement à réaliser sa commande. Elles ne sont ni vendues ni partagées avec des tiers."],
      ["14. Litiges", "En cas de désaccord, les parties cherchent d'abord une solution à l'amiable. À défaut, le droit algérien s'applique et les tribunaux compétents sont ceux du siège du Studio."],
    ],
    accept: "En passant commande, vous acceptez ces conditions.",
    close: "Fermer",
  },

  en: {
    title: "Terms of service",
    updated: "Last updated: November 2026",
    intro: "These terms apply to every order placed with STUDIO·IA (the \"Studio\") by a business or individual client (the \"Client\"). Any order, including by WhatsApp, means you accept these terms.",
    items: [
      ["1. The service", "The Studio creates advertising photos and videos with artificial intelligence tools: virtual models, sets and scenes generated digitally. No real photoshoot takes place. The models are AI-created characters and do not depict any real person."],
      ["2. Orders, preview and quotes", "The Client picks a model, a location, a format and a package on the site, then sends the request. The Studio first sends a free preview (one low-resolution visual with a watermark) to approve the model, the location and the look. Once approved, a written quote (WhatsApp or email) sets out the content, price and delivery time. The order is confirmed when the deposit is received."],
      ["3. Prices and payment", "Prices are in Algerian dinars (DA). A 50% deposit is due when ordering; the balance is paid on delivery of the final files, before they are sent in high definition. Monthly packages are paid in advance."],
      ["4. What the Client provides", "The Client sends clear photos of the product (several angles, good light) and all useful details (colors, sizes, logo). The Client confirms they own the product or are allowed to promote it, and hold the rights to any logos and brands provided."],
      ["5. Delivery time", "The delivery time in the quote starts once the deposit and all the Client's materials are received. Late materials or approvals delay delivery by the same amount of time."],
      ["6. Revisions", "Each order includes 2 free rounds of revisions within 7 days of the preview delivery. Requests that change the order (another model, location or format) are billed as new work."],
      ["7. Fidelity guarantee", "If a delivered visual does not match the real product (color, cut, details visible in the photos provided), the Studio redoes it free of charge. The guarantee applies when the Client has provided sharp photos of the product (front, back and details) and reports the difference within 7 days of delivery."],
      ["8. Exclusive model (option)", "On request, the Client can reserve a model exclusively for 6 or 12 months from the order confirmation. During that period, the Studio does not offer this model to another brand in the same product category. The price of the option is stated in the quote."],
      ["9. Usage rights", "Once paid in full, the Client may freely use the delivered visuals to promote their product (website, social media, ads, print), with no time limit. The Studio may show the work in its portfolio unless the Client asks otherwise in writing."],
      ["10. AI transparency", "The visuals are generated by artificial intelligence. Some platforms require this to be disclosed: the Client is responsible for following the rules of the platforms where they publish. The result may differ slightly from the real product; the Studio does its best to stay true to colors and details."],
      ["11. Refused content", "The Studio refuses any illegal, misleading or offensive request, and any imitation of a real person or of a brand the Client does not own."],
      ["12. Cancellation and refunds", "Before work starts, the Client may cancel and get the deposit back, minus costs already incurred. Once work has started, the deposit is kept by the Studio. No refunds after the final files are delivered."],
      ["13. Privacy", "The Client's photos and information are used only to complete their order. They are never sold or shared with third parties."],
      ["14. Disputes", "In case of disagreement, both parties first look for an amicable solution. Failing that, Algerian law applies and the competent courts are those where the Studio is based."],
    ],
    accept: "By ordering, you accept these terms.",
    close: "Close",
  },

  ar: {
    title: "شروط التعامل",
    updated: "آخر تحديث: نوفمبر 2026",
    intro: "هاد الشروط تطبق على كل طلبية مع STUDIO·IA («الاستوديو») من طرف أي زبون، تاجر ولا شخص عادي («الزبون»). أي طلبية، حتى عبر الواتساب، معناها بلي الزبون موافق على هاد الشروط.",
    items: [
      ["1. الخدمة", "الاستوديو يصنع صور وفيديوهات إشهارية بأدوات الذكاء الاصطناعي: عارضين افتراضيين، ديكورات ومشاهد مصنوعة رقميا. ما كاين حتى تصوير حقيقي. العارضين شخصيات مصنوعة بالذكاء الاصطناعي وما يمثلوش حتى شخص حقيقي."],
      ["2. الطلبية، المعاينة والعرض", "الزبون يختار فالموقع العارضة، المكان، نوع المحتوى والباقة، ويبعث الطلب. الاستوديو يبعثلو أولا معاينة مجانية (صورة وحدة بجودة منخفضة وعليها علامة مائية) باش يوافق على العارضة، المكان والنتيجة. من بعد الموافقة، نبعثولو عرض مكتوب (واتساب ولا إيميل) فيه المحتوى، السعر والمدة. الطلبية تتأكد كي يوصل العربون."],
      ["3. الأسعار والدفع", "الأسعار بالدينار الجزائري (دج). نطلبو عربون 50% عند الطلب، والباقي يتخلص عند تسليم الملفات النهائية، قبل ما نبعثوهم بالجودة العالية. الباقات الشهرية تتخلص مسبقا."],
      ["4. واش يبعث الزبون", "الزبون يبعث صور واضحة للمنتج (من بزاف الجهات، بضو مليح) وكل المعلومات اللازمة (الألوان، المقاسات، اللوغو). ويضمن بلي هو مولى المنتج ولا عندو الحق يشهرلو، وعندو الحقوق على اللوغوهات والعلامات لي يبعثها."],
      ["5. المدة", "المدة لي فالعرض تبدا من نهار يوصل العربون وكل الحوايج لي يبعثهم الزبون. إذا تعطل الزبون فالإرسال ولا فالموافقة، التسليم يتأخر بنفس المدة."],
      ["6. التعديلات", "كل طلبية فيها جوج مرات تعديلات بلاش خلال 7 أيام من تسليم النسخة الأولى. التعديلات لي تبدل الطلبية (عارضة أخرى، مكان آخر، نوع آخر) تتحسب كخدمة جديدة."],
      ["7. ضمان المطابقة", "إذا صورة من الصور المسلمة ما كانتش مطابقة للمنتج الحقيقي (اللون، القصّة، التفاصيل لي باينة في الصور المبعوثة)، الاستوديو يعاودها بلاش. الضمان يطبق كي يكون الزبون بعث صور واضحة للمنتج (من القدام، من اللور والتفاصيل) ويعلمنا بالفرق خلال 7 أيام من التسليم."],
      ["8. العارضة الحصرية (خيار)", "على حسب الطلب، الزبون يقدر يحجز عارضة حصرية لمدة 6 ولا 12 شهر من نهار تتأكد الطلبية. خلال هاد المدة، الاستوديو ما يقترحش هاد العارضة على علامة أخرى في نفس مجال المنتجات. سعر هاد الخيار يكون مكتوب في العرض."],
      ["9. حقوق الاستعمال", "بعد الخلاص الكامل، الزبون يقدر يستعمل الصور والفيديوهات بحرية باش يشهر المنتج تاعو (موقع، شبكات التواصل، إشهار، طباعة)، بلا حدود فالوقت. الاستوديو يقدر يورّي الخدمة فالبورتفوليو تاعو، إلا إذا طلب الزبون العكس كتابيا."],
      ["10. الشفافية حول الذكاء الاصطناعي", "الصور والفيديوهات مصنوعة بالذكاء الاصطناعي. بعض المنصات تطلب الإشارة لهذا: الزبون مسؤول يحترم قوانين المنصات لي ينشر فيها. النتيجة تقدر تختلف شوية على المنتج الحقيقي، والاستوديو يحاول يبقى وفي للألوان والتفاصيل."],
      ["11. المحتوى المرفوض", "الاستوديو يرفض أي طلب غير قانوني، مضلل ولا مخالف للأخلاق، وأي تقليد لشخص حقيقي ولا لعلامة تجارية ماشي ملك الزبون."],
      ["12. الإلغاء والاسترجاع", "قبل ما تبدا الخدمة، الزبون يقدر يلغي ويرجعلو العربون، منقوص منو المصاريف لي تخلصت. كي تبدا الخدمة، العربون يبقى للاستوديو. ما كاين حتى استرجاع بعد تسليم الملفات النهائية."],
      ["13. السرية", "صور ومعلومات الزبون تستعمل غير باش ننجزو الطلبية تاعو. ما تتباعش وما تتعطاش لحتى واحد."],
      ["14. النزاعات", "فحالة خلاف، الطرفين يحاولو يلقاو حل بالتراضي. وإلا، القانون الجزائري هو لي يطبق، والمحاكم المختصة هي تاع المكان لي فيه الاستوديو."],
    ],
    accept: "كي تطلب، راك موافق على هاد الشروط.",
    close: "سكّر",
  },
};
