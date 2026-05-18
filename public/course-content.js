// ======= COURSE CONTENT DATA =======
// Full lesson content for each course

const COURSE_LESSONS = {
  foundations: [
    {
      id: 1, title: "ما هي المكملات الغذائية وكيف تعمل؟",
      duration: "15 دقيقة",
      content: `
        <h2>تعريف المكملات الغذائية</h2>
        <p>المكملات الغذائية هي منتجات تُؤخذ بهدف إضافة مواد غذائية قد تكون غير كافية في النظام الغذائي. تشمل الفيتامينات، المعادن، الأعشاب، الأحماض الأمينية، والإنزيمات.</p>
        <div class="lesson-box info">
          <h3>📌 الفرق بين الدواء والمكمل</h3>
          <ul>
            <li><strong>الدواء:</strong> يُعالج مرضاً محدداً، خاضع لرقابة صارمة</li>
            <li><strong>المكمل:</strong> يدعم الصحة العامة، لا يعالج أمراضاً</li>
          </ul>
        </div>
        <h2>كيف تعمل المكملات في الجسم؟</h2>
        <p>تعمل المكملات عبر آليات متعددة:</p>
        <ul>
          <li><strong>تعويض النقص:</strong> مثل فيتامين D للأشخاص الذين لا يتعرضون للشمس كافياً</li>
          <li><strong>دعم الإنزيمات:</strong> الزنك والمغنيسيوم يشاركان في مئات التفاعلات الإنزيمية</li>
          <li><strong>مضادات الأكسدة:</strong> مثل فيتامين C وE لحماية الخلايا</li>
          <li><strong>تعديل الهرمونات:</strong> بعض الأعشاب تؤثر على مستويات الهرمونات</li>
        </ul>
        <div class="lesson-box warning">
          <h3>⚠️ تحذير مهم</h3>
          <p>المكملات لا تُغني عن الغذاء المتوازن. الأفضل دائماً الحصول على العناصر الغذائية من الطعام الطبيعي.</p>
        </div>
        <h2>أشكال المكملات</h2>
        <table class="lesson-table">
          <tr><th>الشكل</th><th>المزايا</th><th>العيوب</th></tr>
          <tr><td>كبسولات</td><td>سهلة البلع، لا طعم</td><td>قد تحتوي مواد حشو</td></tr>
          <tr><td>مسحوق</td><td>جرعة مرنة، امتصاص أسرع</td><td>طعم قد يكون مزعجاً</td></tr>
          <tr><td>سائل</td><td>امتصاص سريع جداً</td><td>أقل استقراراً، تكلفة أعلى</td></tr>
          <tr><td>أقراص</td><td>رخيصة، عمر تخزين طويل</td><td>امتصاص أبطأ</td></tr>
        </table>
      `
    },
    {
      id: 2, title: "الفرق بين الفيتامينات والمعادن",
      duration: "12 دقيقة",
      content: `
        <h2>الفيتامينات: المركبات العضوية الحيوية</h2>
        <p>الفيتامينات مركبات عضوية يحتاجها الجسم بكميات صغيرة للوظائف الحيوية. لا يستطيع الجسم تصنيع معظمها بكميات كافية.</p>
        <h3>الفيتامينات الذائبة في الدهون (A, D, E, K)</h3>
        <div class="lesson-box info">
          <ul>
            <li>تُخزَّن في الكبد والأنسجة الدهنية</li>
            <li>لا تحتاج يومياً — تتراكم في الجسم</li>
            <li><strong>خطر الجرعة الزائدة:</strong> يمكن أن تسبب تسمماً</li>
          </ul>
        </div>
        <h3>الفيتامينات الذائبة في الماء (B, C)</h3>
        <div class="lesson-box success">
          <ul>
            <li>لا تُخزَّن — تُطرح مع البول</li>
            <li>تحتاج تجديداً يومياً</li>
            <li>خطر التسمم منخفض نسبياً</li>
          </ul>
        </div>
        <h2>المعادن: العناصر غير العضوية</h2>
        <table class="lesson-table">
          <tr><th>المعدن</th><th>الوظيفة الرئيسية</th><th>مصادر غذائية</th></tr>
          <tr><td>الكالسيوم</td><td>العظام والأسنان</td><td>الألبان، البروكلي</td></tr>
          <tr><td>المغنيسيوم</td><td>300+ تفاعل إنزيمي</td><td>المكسرات، الخضروات الورقية</td></tr>
          <tr><td>الزنك</td><td>المناعة والتئام الجروح</td><td>اللحوم، البذور</td></tr>
          <tr><td>الحديد</td><td>نقل الأكسجين</td><td>اللحوم الحمراء، العدس</td></tr>
          <tr><td>السيلينيوم</td><td>مضاد أكسدة، الغدة الدرقية</td><td>المكسرات البرازيلية</td></tr>
        </table>
      `
    },
    {
      id: 3, title: "كيفية قراءة ملصقات المكملات",
      duration: "18 دقيقة",
      content: `
        <h2>عناصر الملصق الأساسية</h2>
        <p>قراءة الملصق بشكل صحيح تحميك من الشراء الخاطئ وتضمن الجودة.</p>
        <h3>1. حجم الحصة (Serving Size)</h3>
        <div class="lesson-box info">
          <p>انتبه! الأرقام على الملصق تعود لحصة واحدة، وقد تحتوي العبوة على عدة حصص. مثال: "حجم الحصة: 2 كبسولة" — يعني أن الجرعة الموصى بها كبسولتان.</p>
        </div>
        <h3>2. قائمة المكونات (Supplement Facts)</h3>
        <ul>
          <li><strong>المكون الفعّال:</strong> المادة الرئيسية (مثل Vitamin D3)</li>
          <li><strong>الشكل الكيميائي:</strong> مهم جداً للامتصاص (مثل Magnesium Glycinate vs Oxide)</li>
          <li><strong>الكمية:</strong> بالمليغرام أو الميكروغرام</li>
          <li><strong>% DV:</strong> نسبة من الاحتياج اليومي الموصى به</li>
        </ul>
        <h3>3. المكونات الأخرى (Other Ingredients)</h3>
        <div class="lesson-box warning">
          <p>تشمل: مواد الحشو، الملونات، المواد الحافظة. ابحث عن منتجات بأقل مكونات إضافية.</p>
          <p><strong>مكونات يجب تجنبها:</strong> Magnesium Stearate (بكميات كبيرة)، Titanium Dioxide، الألوان الاصطناعية.</p>
        </div>
        <h3>4. شهادات الجودة</h3>
        <table class="lesson-table">
          <tr><th>الشهادة</th><th>ما تعني</th></tr>
          <tr><td>NSF Certified</td><td>اختبار مستقل للنقاء والمحتوى</td></tr>
          <tr><td>USP Verified</td><td>معايير الدستور الأمريكي للأدوية</td></tr>
          <tr><td>Informed Sport</td><td>خالٍ من المواد المحظورة رياضياً</td></tr>
          <tr><td>GMP Certified</td><td>ممارسات تصنيع جيدة</td></tr>
        </table>
      `
    },
    {
      id: 4, title: "الجرعات الآمنة والفعّالة",
      duration: "20 دقيقة",
      content: `
        <h2>مبدأ الجرعة في المكملات</h2>
        <p>الجرعة الصحيحة هي الجرعة التي تحقق الفائدة دون أضرار. "الكمية تصنع السُّم" — حتى الماء يمكن أن يكون ضاراً بكميات كبيرة.</p>
        <h3>مصطلحات الجرعة</h3>
        <table class="lesson-table">
          <tr><th>المصطلح</th><th>التعريف</th></tr>
          <tr><td>RDA</td><td>الكمية اليومية الموصى بها لمنع النقص</td></tr>
          <tr><td>AI</td><td>الكمية الكافية (عند عدم توفر RDA)</td></tr>
          <tr><td>UL</td><td>الحد الأعلى الآمن — لا تتجاوزه</td></tr>
          <tr><td>Therapeutic Dose</td><td>الجرعة العلاجية — أعلى من RDA لحالة محددة</td></tr>
        </table>
        <div class="lesson-box warning">
          <h3>⚠️ عوامل تؤثر على الجرعة المناسبة</h3>
          <ul>
            <li>العمر والجنس</li>
            <li>الوزن والتركيبة الجسدية</li>
            <li>الحالة الصحية والأمراض المزمنة</li>
            <li>الأدوية المستخدمة</li>
            <li>مستوى النقص الحالي</li>
          </ul>
        </div>
        <h2>جرعات المكملات الشائعة</h2>
        <table class="lesson-table">
          <tr><th>المكمل</th><th>الجرعة الوقائية</th><th>الجرعة العلاجية</th><th>الحد الأعلى</th></tr>
          <tr><td>فيتامين D3</td><td>1000-2000 IU</td><td>4000-10000 IU</td><td>10000 IU</td></tr>
          <tr><td>المغنيسيوم</td><td>200-400 مغ</td><td>400-800 مغ</td><td>1000 مغ</td></tr>
          <tr><td>الزنك</td><td>15-25 مغ</td><td>30-50 مغ</td><td>40 مغ</td></tr>
          <tr><td>أوميغا-3</td><td>1-2 غ EPA+DHA</td><td>2-4 غ</td><td>5 غ</td></tr>
        </table>
      `
    },
    {
      id: 5, title: "التوقيت المثالي لكل مكمل",
      duration: "15 دقيقة",
      content: `
        <h2>لماذا يهم التوقيت؟</h2>
        <p>التوقيت الصحيح يمكن أن يزيد الامتصاص بنسبة 30-50% ويقلل الآثار الجانبية.</p>
        <h3>مع الطعام أم بدونه؟</h3>
        <div class="lesson-box info">
          <h4>مع الطعام (أفضل):</h4>
          <ul>
            <li>الفيتامينات الذائبة في الدهون (A, D, E, K) — تحتاج دهوناً للامتصاص</li>
            <li>المغنيسيوم — يقلل الغثيان</li>
            <li>الحديد مع فيتامين C — يزيد الامتصاص</li>
            <li>الزنك — يقلل الغثيان</li>
          </ul>
        </div>
        <div class="lesson-box success">
          <h4>بدون طعام (أفضل أو مقبول):</h4>
          <ul>
            <li>الأحماض الأمينية (BCAA, Glutamine) — امتصاص أسرع</li>
            <li>الكرياتين — يمكن في أي وقت</li>
            <li>الكافيين — قبل التمرين بـ 30-60 دقيقة</li>
          </ul>
        </div>
        <h3>جدول التوقيت اليومي</h3>
        <table class="lesson-table">
          <tr><th>الوقت</th><th>المكملات المناسبة</th></tr>
          <tr><td>الصباح مع الفطور</td><td>فيتامين D, B Complex, أوميغا-3, المغنيسيوم</td></tr>
          <tr><td>قبل التمرين (30-60 د)</td><td>الكافيين, بيتا-ألانين, Citrulline</td></tr>
          <tr><td>بعد التمرين</td><td>البروتين, الكرياتين, BCAA</td></tr>
          <tr><td>الليل قبل النوم</td><td>المغنيسيوم Glycinate, Ashwagandha, Melatonin</td></tr>
        </table>
      `
    },
    {
      id: 6, title: "التفاعلات الشائعة التي يجب تجنبها",
      duration: "22 دقيقة",
      content: `
        <h2>أنواع التفاعلات</h2>
        <p>التفاعلات بين المكملات يمكن أن تكون إيجابية (تآزر) أو سلبية (تعارض).</p>
        <h3>التفاعلات الإيجابية (التآزر)</h3>
        <div class="lesson-box success">
          <table class="lesson-table">
            <tr><th>المكمل 1</th><th>المكمل 2</th><th>الفائدة</th></tr>
            <tr><td>فيتامين D</td><td>K2</td><td>K2 يوجّه الكالسيوم للعظام ويمنع ترسبه في الشرايين</td></tr>
            <tr><td>الحديد</td><td>فيتامين C</td><td>يزيد امتصاص الحديد 3 أضعاف</td></tr>
            <tr><td>المغنيسيوم</td><td>فيتامين B6</td><td>B6 يزيد امتصاص المغنيسيوم داخل الخلايا</td></tr>
            <tr><td>الكركمين</td><td>البيبيرين</td><td>البيبيرين يزيد امتصاص الكركمين 2000%</td></tr>
          </table>
        </div>
        <h3>التفاعلات السلبية (التعارض)</h3>
        <div class="lesson-box warning">
          <table class="lesson-table">
            <tr><th>المكمل 1</th><th>المكمل 2</th><th>المشكلة</th></tr>
            <tr><td>الكالسيوم</td><td>الحديد</td><td>يتنافسان على نفس ناقل الامتصاص</td></tr>
            <tr><td>الزنك</td><td>النحاس</td><td>الزنك الزائد يسبب نقص النحاس</td></tr>
            <tr><td>فيتامين E</td><td>فيتامين K</td><td>E الزائد يتعارض مع تخثر الدم</td></tr>
          </table>
        </div>
        <h3>التفاعلات مع الأدوية</h3>
        <div class="lesson-box error">
          <ul>
            <li><strong>أوميغا-3 + مضادات التخثر:</strong> يزيد خطر النزيف</li>
            <li><strong>St. John's Wort + أدوية كثيرة:</strong> يقلل فعاليتها</li>
            <li><strong>المغنيسيوم + المضادات الحيوية:</strong> يقلل امتصاص الدواء</li>
            <li><strong>الجنكو + الأسبرين:</strong> يزيد خطر النزيف</li>
          </ul>
        </div>
      `
    },
    {
      id: 7, title: "كيفية اختيار علامة تجارية موثوقة",
      duration: "16 دقيقة",
      content: `
        <h2>لماذا تختلف جودة المكملات؟</h2>
        <p>دراسات متعددة أثبتت أن كثيراً من المكملات لا تحتوي على ما هو مكتوب على الملصق. بعضها يحتوي على 20% فقط من الجرعة المعلنة!</p>
        <h3>معايير اختيار العلامة التجارية</h3>
        <div class="lesson-box info">
          <h4>✅ علامات الجودة:</h4>
          <ul>
            <li>شهادات NSF, USP, Informed Sport, Banned Substances Control Group</li>
            <li>اختبار طرف ثالث (Third-Party Testing)</li>
            <li>شفافية في المصادر والتصنيع</li>
            <li>تقديم نتائج الاختبارات (Certificate of Analysis)</li>
            <li>تاريخ طويل في السوق مع سمعة جيدة</li>
          </ul>
        </div>
        <div class="lesson-box warning">
          <h4>❌ علامات التحذير:</h4>
          <ul>
            <li>ادعاءات مبالغ فيها ("يعالج السرطان"، "يزيد الطول")</li>
            <li>سعر منخفض جداً مقارنة بالمنافسين</li>
            <li>عدم وجود معلومات تواصل واضحة</li>
            <li>Proprietary Blends بدون كميات محددة</li>
            <li>ملصقات بأخطاء إملائية أو تصميم رديء</li>
          </ul>
        </div>
        <h3>علامات تجارية موثوقة عالمياً</h3>
        <table class="lesson-table">
          <tr><th>العلامة</th><th>التخصص</th><th>الشهادات</th></tr>
          <tr><td>Thorne Research</td><td>مكملات طبية عالية الجودة</td><td>NSF, GMP</td></tr>
          <tr><td>Pure Encapsulations</td><td>خالٍ من المواد المثيرة للحساسية</td><td>NSF, GMP</td></tr>
          <tr><td>NOW Foods</td><td>تنوع واسع بسعر معقول</td><td>GMP, Informed Sport</td></tr>
          <tr><td>Life Extension</td><td>مكملات طول العمر</td><td>NSF</td></tr>
        </table>
      `
    },
    {
      id: 8, title: "بناء روتين مكملات شخصي",
      duration: "25 دقيقة",
      content: `
        <h2>خطوات بناء روتينك الشخصي</h2>
        <h3>الخطوة 1: تقييم نظامك الغذائي</h3>
        <p>قبل شراء أي مكمل، قيّم نظامك الغذائي لمدة أسبوع. ما العناصر الغذائية التي تفتقدها؟</p>
        <div class="lesson-box info">
          <h4>الأسئلة الأساسية:</h4>
          <ul>
            <li>هل تأكل أسماكاً دهنية مرتين أسبوعياً؟ (إذا لا → أوميغا-3)</li>
            <li>هل تتعرض للشمس يومياً؟ (إذا لا → فيتامين D)</li>
            <li>هل تأكل خضروات ورقية يومياً؟ (إذا لا → المغنيسيوم)</li>
            <li>هل تأكل لحوماً بانتظام؟ (إذا لا → B12, الحديد, الزنك)</li>
          </ul>
        </div>
        <h3>الخطوة 2: إجراء التحاليل</h3>
        <table class="lesson-table">
          <tr><th>التحليل</th><th>القيمة المثلى</th><th>سبب الأهمية</th></tr>
          <tr><td>25-OH Vitamin D</td><td>50-80 ng/mL</td><td>أكثر من 80% من الناس ناقصون</td></tr>
          <tr><td>Ferritin (الحديد)</td><td>50-150 ng/mL</td><td>نقصه يسبب التعب والضباب الذهني</td></tr>
          <tr><td>Magnesium RBC</td><td>5.5-7 mg/dL</td><td>المغنيسيوم في الدم لا يعكس المخزون الحقيقي</td></tr>
          <tr><td>Omega-3 Index</td><td>>8%</td><td>مؤشر صحة القلب والدماغ</td></tr>
        </table>
        <h3>الخطوة 3: البدء بالأساسيات</h3>
        <div class="lesson-box success">
          <h4>الثلاثي الأساسي لمعظم الناس:</h4>
          <ol>
            <li><strong>فيتامين D3 + K2:</strong> 2000-5000 IU D3 + 100-200 mcg K2</li>
            <li><strong>أوميغا-3:</strong> 1-2 غ EPA+DHA يومياً</li>
            <li><strong>المغنيسيوم Glycinate:</strong> 300-400 مغ قبل النوم</li>
          </ol>
        </div>
        <h3>الخطوة 4: التقييم والتعديل</h3>
        <p>بعد 3 أشهر، أعد التحاليل وقيّم كيف تشعر. المكملات الجيدة يجب أن تُحدث فرقاً ملحوظاً.</p>
      `
    }
  ],

  hormones: [
    {
      id: 1, title: "فهم محور HPG (Hypothalamic-Pituitary-Gonadal)",
      duration: "20 دقيقة",
      content: `
        <h2>محور HPG: قائد الجهاز الهرموني</h2>
        <p>محور HPG هو نظام هرموني معقد يتحكم في الإنجاب والهرمونات الجنسية. يعمل كحلقة تغذية راجعة دقيقة.</p>
        <h3>كيف يعمل المحور؟</h3>
        <div class="lesson-box info">
          <ol>
            <li><strong>الوطاء (Hypothalamus):</strong> يُفرز GnRH (هرمون إطلاق الغونادوتروبين)</li>
            <li><strong>الغدة النخامية (Pituitary):</strong> تستجيب بإفراز LH و FSH</li>
            <li><strong>الغدد التناسلية (Gonads):</strong> تُنتج التستوستيرون/الإستروجين</li>
            <li><strong>التغذية الراجعة:</strong> الهرمونات ترسل إشارات للوطاء لتنظيم الإفراز</li>
          </ol>
        </div>
        <h3>العوامل التي تُضعف المحور</h3>
        <div class="lesson-box warning">
          <ul>
            <li>التوتر المزمن (الكورتيزول المرتفع)</li>
            <li>قلة النوم (أقل من 7 ساعات)</li>
            <li>الدهون الجسدية المرتفعة (>25% للرجال)</li>
            <li>الإفراط في التمرين دون تعافٍ كافٍ</li>
            <li>نقص الزنك والمغنيسيوم والفيتامين D</li>
          </ul>
        </div>
      `
    },
    {
      id: 2, title: "مكملات رفع التستوستيرون الطبيعي",
      duration: "25 دقيقة",
      content: `
        <h2>المكملات المثبتة علمياً لدعم التستوستيرون</h2>
        <div class="lesson-box success">
          <h3>الدرجة الأولى (أدلة قوية):</h3>
          <table class="lesson-table">
            <tr><th>المكمل</th><th>الجرعة</th><th>الآلية</th></tr>
            <tr><td>الزنك</td><td>25-45 مغ/يوم</td><td>ضروري لإنتاج التستوستيرون مباشرة</td></tr>
            <tr><td>فيتامين D3</td><td>3000-5000 IU</td><td>يرتبط بمستقبلات الخلايا المنتجة للتستوستيرون</td></tr>
            <tr><td>المغنيسيوم</td><td>400-500 مغ</td><td>يقلل SHBG ويزيد التستوستيرون الحر</td></tr>
          </table>
        </div>
        <div class="lesson-box info">
          <h3>الدرجة الثانية (أدلة معتدلة):</h3>
          <table class="lesson-table">
            <tr><th>المكمل</th><th>الجرعة</th><th>الملاحظة</th></tr>
            <tr><td>Ashwagandha</td><td>300-600 مغ</td><td>يخفض الكورتيزول ويرفع التستوستيرون بشكل غير مباشر</td></tr>
            <tr><td>Tongkat Ali</td><td>200-400 مغ</td><td>يقلل SHBG، أفضل للرجال فوق 40</td></tr>
            <tr><td>Boron</td><td>6-10 مغ</td><td>يقلل SHBG ويزيد التستوستيرون الحر</td></tr>
          </table>
        </div>
        <div class="lesson-box warning">
          <h3>⚠️ مكملات لا تعمل (رغم الادعاءات):</h3>
          <ul>
            <li>Tribulus Terrestris — لا دليل علمي قوي</li>
            <li>DHEA — يتحول للإستروجين، قد يكون ضاراً</li>
            <li>معظم "Testosterone Boosters" التجارية</li>
          </ul>
        </div>
      `
    }
  ],

  longevity_course: [
    {
      id: 1, title: "نظريات الشيخوخة الحديثة",
      duration: "25 دقيقة",
      content: `
        <h2>لماذا نشيخ؟ النظريات العلمية الحديثة</h2>
        <p>علم الشيخوخة (Geroscience) تطور بشكل هائل في العقدين الأخيرين. الآن نفهم الشيخوخة على المستوى الجزيئي.</p>
        <h3>نظرية الضرر التراكمي</h3>
        <div class="lesson-box info">
          <p>الشيخوخة ناتجة عن تراكم الضرر في الحمض النووي والبروتينات والدهون مع مرور الوقت. الجذور الحرة تلعب دوراً رئيسياً.</p>
        </div>
        <h3>نظرية الشيخوخة الإيبيجينية (David Sinclair)</h3>
        <div class="lesson-box info">
          <p>الشيخوخة ناتجة عن فقدان المعلومات الإيبيجينية — التعليمات التي تخبر الجينات متى تعمل ومتى تتوقف. هذه المعلومات يمكن استعادتها نظرياً.</p>
        </div>
        <h3>العلامات التسع للشيخوخة (Hallmarks of Aging)</h3>
        <table class="lesson-table">
          <tr><th>العلامة</th><th>الوصف</th></tr>
          <tr><td>عدم استقرار الجينوم</td><td>تراكم الطفرات في الحمض النووي</td></tr>
          <tr><td>تآكل التيلوميرات</td><td>قصر نهايات الكروموسومات مع كل انقسام</td></tr>
          <tr><td>التغيرات الإيبيجينية</td><td>تغير أنماط التعبير الجيني</td></tr>
          <tr><td>فقدان البروتيوستاسيس</td><td>تراكم البروتينات المشوهة</td></tr>
          <tr><td>خلل استشعار المغذيات</td><td>ضعف استجابة mTOR وAMPK وSIRT1</td></tr>
          <tr><td>خلل الميتوكوندريا</td><td>انخفاض إنتاج الطاقة وزيادة الجذور الحرة</td></tr>
          <tr><td>الشيخوخة الخلوية</td><td>تراكم الخلايا الشيخوخية الضارة</td></tr>
          <tr><td>استنزاف الخلايا الجذعية</td><td>ضعف قدرة الأنسجة على التجدد</td></tr>
          <tr><td>تغير الاتصال بين الخلايا</td><td>الالتهاب المزمن المنخفض الدرجة</td></tr>
        </table>
      `
    },
    {
      id: 2, title: "NAD+ وأهميته في الشيخوخة",
      duration: "20 دقيقة",
      content: `
        <h2>NAD+: جزيء الطاقة والشباب</h2>
        <p>NAD+ (Nicotinamide Adenine Dinucleotide) هو أحد أهم الجزيئات في الجسم. ينخفض مستواه بنسبة 50% بين سن 20 و50.</p>
        <h3>وظائف NAD+</h3>
        <div class="lesson-box info">
          <ul>
            <li>وقود الميتوكوندريا لإنتاج ATP</li>
            <li>تفعيل السيرتوينات (SIRT1-7) — إنزيمات مضادة للشيخوخة</li>
            <li>إصلاح الحمض النووي التالف</li>
            <li>تنظيم الساعة البيولوجية</li>
          </ul>
        </div>
        <h3>كيف ترفع NAD+؟</h3>
        <table class="lesson-table">
          <tr><th>الطريقة</th><th>الفعالية</th><th>التكلفة</th></tr>
          <tr><td>NMN (Nicotinamide Mononucleotide)</td><td>عالية</td><td>مرتفعة</td></tr>
          <tr><td>NR (Nicotinamide Riboside)</td><td>عالية</td><td>متوسطة</td></tr>
          <tr><td>Niacin (B3)</td><td>متوسطة</td><td>منخفضة</td></tr>
          <tr><td>الصيام المتقطع</td><td>عالية</td><td>مجانية</td></tr>
          <tr><td>التمرين المكثف</td><td>عالية</td><td>مجانية</td></tr>
        </table>
        <div class="lesson-box warning">
          <p><strong>ملاحظة:</strong> NMN وNR مكلفان. الصيام والتمرين يرفعان NAD+ بشكل طبيعي وفعّال.</p>
        </div>
      `
    }
  ],

  sports_nutrition: [
    {
      id: 1, title: "الكرياتين — العلم الكامل",
      duration: "20 دقيقة",
      content: `
        <h2>الكرياتين: أكثر مكمل رياضي مدروساً في التاريخ</h2>
        <p>أكثر من 500 دراسة علمية على مدى 30 عاماً تؤكد فعاليته وأمانه. الكرياتين هو المكمل الرياضي الوحيد الذي يحظى بإجماع علمي شبه كامل.</p>
        <h3>كيف يعمل الكرياتين؟</h3>
        <div class="lesson-box info">
          <p>يزيد من مخزون فوسفوكرياتين في العضلات، مما يسرّع إعادة تصنيع ATP خلال التمارين الشديدة القصيرة (رفع الأثقال، العدو السريع).</p>
          <p>النتيجة: تستطيع رفع وزن أثقل أو تكرار أكثر — مما يؤدي لنمو عضلي أكبر على المدى الطويل.</p>
        </div>
        <h3>الفوائد المثبتة علمياً</h3>
        <div class="lesson-box success">
          <ul>
            <li>زيادة القوة بنسبة 5-15%</li>
            <li>زيادة كتلة العضلات (بالتدريب)</li>
            <li>تحسين التعافي بين الجلسات</li>
            <li>فوائد معرفية (يحسن الذاكرة والتركيز)</li>
            <li>قد يفيد في أمراض عصبية (الباركنسون، ألزهايمر)</li>
          </ul>
        </div>
        <h3>الجرعة والبروتوكول</h3>
        <table class="lesson-table">
          <tr><th>البروتوكول</th><th>الجرعة</th><th>المدة</th></tr>
          <tr><td>التحميل (اختياري)</td><td>20 غ/يوم (4×5 غ)</td><td>5-7 أيام</td></tr>
          <tr><td>الصيانة</td><td>3-5 غ/يوم</td><td>مستمر</td></tr>
          <tr><td>بدون تحميل</td><td>5 غ/يوم</td><td>4-6 أسابيع للوصول لنفس المستوى</td></tr>
        </table>
        <div class="lesson-box info">
          <p><strong>أفضل نوع:</strong> Creatine Monohydrate — الأرخص والأكثر دراسة. لا تدفع أكثر لـ "Creatine HCL" أو "Kre-Alkalyn".</p>
        </div>
      `
    }
  ],

  brain_optimization: [
    {
      id: 1, title: "كيف يعمل الدماغ وما الذي يحسّنه؟",
      duration: "18 دقيقة",
      content: `
        <h2>الناقلات العصبية: كيمياء الدماغ</h2>
        <p>الدماغ يعمل عبر شبكة من الناقلات العصبية الكيميائية. فهمها يساعدك في اختيار المكملات الصحيحة.</p>
        <h3>الناقلات الرئيسية وتأثيرها</h3>
        <table class="lesson-table">
          <tr><th>الناقل</th><th>الوظيفة</th><th>كيف تدعمه</th></tr>
          <tr><td>الدوبامين</td><td>الدافعية، المكافأة، التركيز</td><td>L-Tyrosine, Mucuna Pruriens</td></tr>
          <tr><td>السيروتونين</td><td>المزاج، النوم، الشهية</td><td>5-HTP, Tryptophan</td></tr>
          <tr><td>الأسيتيلكولين</td><td>الذاكرة، التعلم</td><td>Alpha-GPC, CDP-Choline</td></tr>
          <tr><td>GABA</td><td>الاسترخاء، تقليل القلق</td><td>L-Theanine, Magnesium</td></tr>
          <tr><td>النورإبينفرين</td><td>التنبه، التركيز</td><td>L-Tyrosine</td></tr>
        </table>
        <h3>أفضل المكملات للتركيز والذاكرة</h3>
        <div class="lesson-box success">
          <table class="lesson-table">
            <tr><th>المكمل</th><th>الجرعة</th><th>الفائدة</th></tr>
            <tr><td>Bacopa Monnieri</td><td>300-600 مغ</td><td>يحسن الذاكرة طويلة المدى (نتائج بعد 8-12 أسبوع)</td></tr>
            <tr><td>Lion's Mane</td><td>500-1000 مغ</td><td>يحفز نمو الخلايا العصبية (NGF)</td></tr>
            <tr><td>Alpha-GPC</td><td>300-600 مغ</td><td>يزيد الأسيتيلكولين للذاكرة والتركيز</td></tr>
            <tr><td>L-Theanine + Caffeine</td><td>200+100 مغ</td><td>تركيز هادئ بدون توتر</td></tr>
          </table>
        </div>
      `
    }
  ]
};

// ======= COURSE VIEWER =======
let currentCourseId = null;
let currentLessonIdx = 0;
let completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '{}');

function startCourse(courseId) {
  currentCourseId = courseId;
  currentLessonIdx = 0;
  renderCourseViewer();
}

function renderCourseViewer() {
  const course = COURSES_DATA.find(c => c.id === currentCourseId);
  const lessons = COURSE_LESSONS[currentCourseId] || [];
  if (!course) return;

  // If no lessons built yet, show topics as lesson list
  const lessonList = lessons.length > 0 ? lessons : course.topics.map((t, i) => ({
    id: i + 1,
    title: t,
    duration: '10 دقائق',
    content: `<div class="lesson-box info"><h2>${t}</h2><p>المحتوى التفصيلي لهذا الدرس قيد الإعداد. تابع التحديثات القادمة!</p></div>`
  }));

  const lesson = lessonList[currentLessonIdx];
  const completedKey = `${currentCourseId}_${lesson.id}`;
  const isCompleted = completedLessons[completedKey];
  const totalLessons = lessonList.length;
  const completedCount = lessonList.filter((l, i) => completedLessons[`${currentCourseId}_${l.id}`]).length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="course-viewer">
      <!-- Header -->
      <div class="cv-header">
        <div class="cv-course-title">${course.emoji} ${course.title}</div>
        <div class="cv-progress-bar">
          <div class="cv-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="cv-progress-text">${completedCount}/${totalLessons} درس مكتمل (${progressPct}%)</div>
      </div>

      <!-- Lesson Sidebar + Content -->
      <div class="cv-layout">
        <!-- Sidebar: lesson list -->
        <div class="cv-sidebar">
          ${lessonList.map((l, i) => {
            const k = `${currentCourseId}_${l.id}`;
            const done = completedLessons[k];
            return `
              <div class="cv-lesson-item ${i === currentLessonIdx ? 'active' : ''} ${done ? 'done' : ''}"
                   onclick="jumpToLesson(${i})">
                <span class="cv-lesson-num">${done ? '✅' : (i + 1)}</span>
                <span class="cv-lesson-name">${l.title}</span>
                <span class="cv-lesson-dur">${l.duration}</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Main content -->
        <div class="cv-content">
          <div class="cv-lesson-header">
            <h2>الدرس ${currentLessonIdx + 1}: ${lesson.title}</h2>
            <span class="cv-duration">⏱ ${lesson.duration}</span>
          </div>
          <div class="cv-lesson-body">
            ${lesson.content}
          </div>
          <div class="cv-actions">
            <button class="btn-secondary" onclick="prevLesson()" ${currentLessonIdx === 0 ? 'disabled' : ''}>
              ← السابق
            </button>
            <button class="btn-primary" onclick="markAndNext('${completedKey}', ${currentLessonIdx}, ${totalLessons})">
              ${isCompleted ? (currentLessonIdx < totalLessons - 1 ? 'التالي →' : '🎉 إعادة الكورس') : '✅ إتمام والتالي'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('open');
}

function jumpToLesson(idx) {
  currentLessonIdx = idx;
  renderCourseViewer();
}

function prevLesson() {
  if (currentLessonIdx > 0) {
    currentLessonIdx--;
    renderCourseViewer();
  }
}

function markAndNext(key, idx, total) {
  completedLessons[key] = true;
  localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  if (idx < total - 1) {
    currentLessonIdx++;
  } else {
    // Course completed!
    showCourseCompletion();
    return;
  }
  renderCourseViewer();
}

function showCourseCompletion() {
  const course = COURSES_DATA.find(c => c.id === currentCourseId);
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div style="text-align:center;padding:3rem 2rem">
      <div style="font-size:5rem;margin-bottom:1rem">🎉</div>
      <h2 style="font-size:2rem;margin-bottom:0.5rem">أحسنت! أكملت الكورس</h2>
      <p style="color:#888;font-size:1.1rem;margin-bottom:2rem">${course.emoji} ${course.title}</p>
      <div style="background:var(--card2);border-radius:12px;padding:1.5rem;margin-bottom:2rem;border:1px solid var(--border2)">
        <div style="font-size:3rem;font-weight:900;color:var(--accent)">${Object.keys(completedLessons).filter(k=>k.startsWith(currentCourseId)).length}</div>
        <div style="color:#888">درس مكتمل</div>
      </div>
      <button class="btn-primary" onclick="closeModal()">العودة للكورسات</button>
    </div>
  `;
}

// Add gut_health course lessons
COURSE_LESSONS.gut_health = [
  {
    id: 1, title: "محور الأمعاء-الدماغ",
    duration: "18 دقيقة",
    content: `
      <h2>الأمعاء: الدماغ الثاني</h2>
      <p>الأمعاء تحتوي على أكثر من 100 مليون خلية عصبية — أكثر من الحبل الشوكي! يُسمى هذا الجهاز العصبي المعوي (Enteric Nervous System) بـ"الدماغ الثاني".</p>
      <div class="lesson-box info">
        <h3>كيف تؤثر الأمعاء على الدماغ؟</h3>
        <ul>
          <li>90% من السيروتونين (هرمون السعادة) يُنتج في الأمعاء</li>
          <li>البكتيريا المعوية تُنتج ناقلات عصبية تؤثر على المزاج</li>
          <li>الالتهاب المعوي يرتبط بالاكتئاب والقلق</li>
          <li>العصب المبهم (Vagus Nerve) يربط الأمعاء بالدماغ مباشرة</li>
        </ul>
      </div>
      <h3>مكملات دعم محور الأمعاء-الدماغ</h3>
      <table class="lesson-table">
        <tr><th>المكمل</th><th>الجرعة</th><th>الفائدة</th></tr>
        <tr><td>البروبيوتيك</td><td>10-50 مليار CFU</td><td>يحسن التنوع البكتيري</td></tr>
        <tr><td>L-Glutamine</td><td>5-10 غ</td><td>يغذي خلايا الأمعاء</td></tr>
        <tr><td>Zinc Carnosine</td><td>75 مغ</td><td>يحمي بطانة الأمعاء</td></tr>
      </table>
    `
  }
];
