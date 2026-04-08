from datetime import datetime

from pdf_generator.contracts import entities, enums

contract = entities.PRContract(
    id=7232337699565211648,
    password=73688176,
    date=datetime.strptime("2023-12-10", "%Y-%m-%d").date(),
    start_date=datetime.strptime("2023-12-11", "%Y-%m-%d").date(),
    end_date=datetime.strptime("2024-12-10", "%Y-%m-%d").date(),
    handover_date=datetime.strptime("2023-12-11", "%Y-%m-%d").date(),
    deposit_amount=100000000,
    monthly_rent_amount=5200000,
    contract_duration=360,
    landlord_penalty_fee=300000,
    tenant_penalty_fee=2000000,
    status=enums.ContractStatus.COMPLETED,
    owner_type=enums.PartyType.LANDLORD,
    tenant_family_members_count=4,
    tracking_code=55667788923,
    landlord=entities.Landlord(
        user_id=1,
        first_name="عین الله",
        last_name="احمدی تبار",
        father_name="فضل الله",
        national_code="3782168501",
        mobile="09199848190",
        address="شهر قائم - خیابان قائم - بین کوچه 31 تا 29 - پلاک 395",
        signed_at=datetime.strptime("2024-08-25T14:52:28.501026Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
        deposit_bank_account=entities.BankAccount(
            id=1,
            iban="123456000000004518264578",
            owner_name="علی رفیعی",
        ),
        rent_bank_account=entities.BankAccount(
            id=1,
            iban="123456000000004518264578",
            owner_name="علی رفیعی",
        )
    ),
    tenant=entities.Tenant(
        user_id=2,
        first_name="روح الله",
        last_name="رحمت زاده",
        father_name="فتحعلی",
        national_code="4031982070",
        mobile="09199848190",
        address="شهر قائم - خیابان قائم - بین کوچه 31 تا 29 - پلاک 395",
        signed_at=datetime.strptime("2024-08-25T15:11:42.631126Z", "%Y-%m-%dT%H:%M:%S.%fZ"),
        bank_account=entities.BankAccount(
            id=1,
            iban="123456000000004518264578",
            owner_name="علی رفیعی",
        )
    ),
    property=entities.Property(
        property_type=enums.PropertyType.APARTMENT_RESIDENTIAL,
        deed_status=enums.PropertyDeedStatus.SHAKHSI,
        address="شهر قائم - خیابان قائم - بین کوچه 31 تا 29 - پلاک 395",
        city=entities.City(
            name="قم",
            province="قم"
        ),
        elevator=True,
        electricity_bill_id="123123",
        # parking=True,
        number_of_rooms=2,
        area=84.5,
        build_year=2020,
        parking=True,
        parking_number=16,
        postal_code="1234567890",
        registration_area="پنج",
        restroom_type=enums.PropertyRestroomType.IRANI,
        storage_room=False,
        storage_room_area=2.34,
        storage_room_number=16,
        structure_type=enums.PropertyStructureType.CONCRETE,
        main_register_number=12,
        sub_register_number=123,
        direction_type=enums.PropertyDirectionType.NORTHERN,
        is_rebuilt=False,
        facade_types=[enums.PropertyFacadeType.BRICK],
        flooring_types=[enums.PropertyFlooringType.CERAMIC, enums.PropertyFlooringType.PARQUET],
        landline=True,
        landline_number=['02532048', '02532048', '02532048'],
        heating_system_types=[enums.PropertyHeatingSystemType.RADIATOR],
        cooling_system_types=[enums.PropertyCoolingSystemType.AIR_CONDITIONER, enums.PropertyCoolingSystemType.WATER_COOLER],
        kitchen_type=enums.PropertyKitchenType.OPEN,
        water_supply_type=enums.PropertySupplyType.PUBLIC,
        electricity_supply_type=enums.PropertySupplyType.PRIVATE,
        gas_supply_type=enums.PropertySupplyType.PRIVATE,
        sewage_supply_type=enums.PropertySupplyType.PUBLIC,
        other_facilities=[
            enums.PropertyFacilitiesType.GAS_STOVE,
            enums.PropertyFacilitiesType.REMOTE_CONTROLLED_DOOR,
            enums.PropertyFacilitiesType.KITCHEN_CABINETS,
            enums.PropertyFacilitiesType.VIDEO_INTERCOM,
            enums.PropertyFacilitiesType.RANGE_HOOD,
            enums.PropertyFacilitiesType.CURTAINS,
        ],
        description="ملک به صورت خودکار به سیستم های آب و گاز و برق و تلفن و پارکینگ و سرویس های خدماتی متصل است.",
    ),
    payments=[
        entities.ContractPayment(
            amount=40000000,
            description="",
            is_bulk=False,
            method=enums.PaymentMethod.CASH,
            type=enums.PaymentType.DEPOSIT,
            due_date=datetime.strptime("2023-12-10", "%Y-%m-%d").date(),
        ),
        entities.ContractPayment(
            amount=60000000,
            description="",
            is_bulk=False,
            method=enums.PaymentMethod.CHEQUE,
            type=enums.PaymentType.DEPOSIT,
            due_date=datetime.strptime("2024-02-10", "%Y-%m-%d").date(),
            cheque=entities.Cheque(
                serial="123",
                series="456",
                sayaad_code="1234567890",
                category=enums.ChequeCategory.CASH_MANAGEMENT,
                payee_type=enums.ChequePayeeType.INDIVIDUAL,
                payee_national_code="0372345694"
            )
        ),
        entities.ContractPayment(
            amount=5200000,
            description="",
            is_bulk=True,
            method=enums.PaymentMethod.CASH,
            type=enums.PaymentType.RENT,
            due_date=datetime.strptime("2024-06-09", "%Y-%m-%d").date(),
        )
    ],
    clauses=[
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=1,
            subclause_name="تاخیر در پرداخت مبلغ رهن",
            body="در صورت تاخیر در پرداخت مبلغ قرض الحسنه مستاجر حداکثر ظرف 48 ساعت می تواند مبلغ رهن را پرداخت نماید، در غیر اینصورت مالک تا یک هفته حق فسخ یکطرفه قرارداد را دارد."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=2,
            subclause_name="تحویل کلید",
            body="""تمامی وسایل و لوازم را به صحت و سلامت تحویل داده می شود. مستاجر مکلف است در زمان تخلیه، مورد اجاره را به همان وضعی که تحویل گرفته به موجر تحویل داده و رسید دریافت نماید و در صورت حدوث خسارت نسبت به مورد اجاره، مستاجر متعهد به جبران خسارت بوده و تهاتر مبلغ خسارات با مبلغ قرض الحسنه توسط موجر مانعی ندارد.
                (به طرفین قرارداد توصیه می شود در لحظه تحویل واحد، فیلم کوتاهی از وضعیت واحد گرفته شود و تا پایان قرارداد از فیلم نگهداری کنند.)
                تبصره:درصورتی که تعارضی در امکانات مورد اجاره از اولین بازدید ملک تا لحظه تحویل ملک وجود داشته باشد، تمام کسری ها باید به امضای مالک در لحظه تحویل برسد. در صورتی که مالک از امضاء امتناع نماید، مستاجر مکلف است با تماس به نیروی انتظامی تقاضای ثبت گزارش کسری امکانات مورد اجاره خواهد کرد. لازم به ذکر است مالک باید ظرف 24 ساعت تعارضات را مطابق تعهدات در قرارداد برطرف نماید در غیر اینصورت مستاجر از لحظه دریافت کلید تا دو هفته حق فسخ یکطرفه قرارداد را خواهد داشت. در صورت فسخ مالک متعهد به پرداخت یک ماه اجاره بهای خالص روزانه (با تبدیل رهن به اجاره) به عنوان خسارت به مالک را خواهد بود.
                """
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=3,
            subclause_name="نحوه استفاده",
            body="مستاجر نمی‌تواند از ملک مورد اجاره، در جهت غیر از کاربری مشخص شده در ماده 2 بند اول <property_type> استفاده کند. مستاجر در تمام مدت اجاره موظف به استفاده از مورد اجاره به نحو متعارف و قانونی می‌باشد و حق استفاده از آن در غیر این ‌صورت را ندارد. مورد اجاره به <tenant_count> نفر داده شده است. در صورت تخلف از موارد فوق موجر حق فسخ یکطرفه تا پایان قرارداد را دارد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=4,
            subclause_name="اجاره به غیر",
            body="مستاجر نمی‌تواند ملک موردنظر را به شخص دیگر اجاره دهد، و فقط خود مستاجر (طرف دوم این معامله) می‌تواند از ملک مذکور استفاده کند. در صورت تخلف از موارد فوق موجر حق فسخ یکطرفه تا پایان قرارداد را دارد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=5,
            subclause_name="هزینه های جاری",
            body="پرداخت هزینه های مصرفی آب/ برق/ گاز/ تلفن/ شارژ/ هزینه های نگهداری ساختمان/ فاضلاب شهری و غیره به عهده مستاجر است و باید در زمان تخلیه، فسخ و یا اقاله، قبوض پرداختی را به موجر ارائه نماید. همچنین عوارض کسب و پیشه برداری/ مالیات بر درآمد (مربوط به ملک های اداری- تجاری) اداره دارایی، حق بیمه کارگران تامین اجتماعی بر عهده مستاجر میباشد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=6,
            subclause_name="عدم پرداخت اجاره بها",
            body="در صورت عدم پرداخت دو قسط از اجاره ماهیانه توسط مستاجر یا تاخیر 3ماه از پرداخت شارژ، امکان فسخ یکطرفه تا پایان قرارداد برای موجر فراهم است.تبصره:پرداخت اجاره بها به غیر از شماره حساب مذکور در قرارداد ممنوع می باشد مگر آنکه موجر به صورت مکتوب رضایت خود را اعلام کرده باشد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=7,
            subclause_name="حق کسب و پیشه",
            body="مبلغ قرض الحسنه پرداختی توسط مستاجر، هیچگونه حقی به عنوان سرقفلی یا حق کسب و پیشه برای مستاجر ایجاد نمیکند و مستاجر حق هیچگونه ادعایی نسبت به سرقفلی و حق کسب و پیشه نداشته و متعهد به تخلیه بی قید و شرط مورد اجاره در زمان تعیین شده میباشد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=8,
            subclause_name="زمان تحویل",
            body="چنانچه مستاجر مورد اجاره را راس تاریخ انقضا این قرارداد تخلیه کامل ننماید و یا به هر دلیل از تحویل آن خودداری نماید، موظف است روزانه مبلغ <tenant_penalty_fee> تومان به عنوان اجرت ایام تصرف بعد از انقضا قرارداد به موجر بپردازد و تهاتر این مبلغ با مبلغ قرض الحسنه توسط موجر مانعی ندارد. در هر حال پرداخت این مبلغ دلیل و مانعی برای پیگیری قضایی جهت تخلیه مورد اجاره از طرف موجر نمیباشد.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مستاجر",
            clause_number=6,
            subclause_number=9,
            subclause_name="بازدید مستاجران جدید",
            body="مستاجر مکلف است 3 هفته پیش از اتمام قرارداد نتیجه نهایی تمدید قرارداد را در قالب پیامک به مالک خود اعلام کند. همچنین مستاجر تا دو هفته پیش از اتمام قرارداد دو ساعت از 3 روز در هفته که از ابتدای هفته توسط مستاجر تعیین می گردد، می بایست در بازه زمانی 11 صبح تا 21 باشد به عنوان بازدید مستاجرین جدید اجازه بازدید دهد. بدیهی است عدم اطلاع مستاجر، جرایم تاخیر عودت مبلغ رهن را تا دو هفته برای مالک به همراه نخواهد داشت.",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مالک",
            clause_number=7,
            subclause_number=1,
            subclause_name=None,
            body="موجر موظف است به محض اتمام مدت اجاره یا فسخ یا اقاله قرارداد، مورد اجاره را تحویل گرفته و کل مبلغ قرض الحسنه را به مستاجر پرداخت نماید. در غیر این صورت می‌بایست به ازای هر روز تاخیر در پرداخت، مبلغ <landlord_penalty_fee> تومان به عنوان خسارت به مستاجر پرداخت کند. ضمنا پرداخت این خسارت مانع از اقامه دعوی جهت مطالبه قرض الحسنه توسط مستاجر نمی‌باشد."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مالک",
            clause_number=7,
            subclause_number=2,
            subclause_name=None,
            body="مالیات مستغلات، تعمیرات اساسی، عوارض شهرداری و مالیات بر مستقلات اجاره بر عهده مالک (موجر) است."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات مالک",
            clause_number=7,
            subclause_number=3,
            subclause_name=None,
            body="هرگونه فعل یا ترک فعل موجر که منجر به سلب انتفاع مستاجر از ممورد اجاره گردد، مسئولیت موجر را برعهده خواهد داشت."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=1,
            subclause_name=None,
            body="کلیه خیارات از جمله خیار غبن به استثناء خیار تدلیس و خیار تخلف از شرط به شرح مقرر در این قرارداد با اقرار طرفین اسقاط گردید. (این بند به معنای آن است که پس از الزامی شدن قرارداد، صرفا با رعایت مفاد این قرارداد، طرفین حق فسخ دارند.)",
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=2,
            subclause_name=None,
            body="در موارد سکوت این قرارداد ، قانون مدنی و قانون روابط موجر و مستاجر 1376 حاکم بر روابط طرفین خواهند بود."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=3,
            subclause_name=None,
            body="هرگونه توافق فی ما بین طرفین قرارداد که در فوق ذکر نگردیده است باید در قسمت توضیحات این قرارداد درج شده و به امضای طرفین و شهود برسد؛ لذا هیچ گونه مذاکرات شفاهی و توافقات کتبی بدون درج در این قرارداد، قابل استناد نیست و طرفین به این امر اقرار نموده و آن را پذیرفته‌اند."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=4,
            subclause_name=None,
            body="کلیه اختلافات و دعاوی ناشی از این قرارداد و یا مرتبط با آن از جمله انعقاد، اعتبار، فسخ، نقض، تفسیر یا اجرای آن به داوری املاین (داور منتخب تحلیل آوران املاک روز) ارجاع می‌گردد که مطابق با مفاد این قرارداد و قوانین مربوطه (که سایر قوانین و مقررات در سایتamline.ir وجود دارد) به صورت قطعی و لازم الاجرا حل‌ و فصل گردد. این شرط داوری، موافقتنامه‌ای مستقل از قرارداد اصلی تلقی می‌شود و در هر حال لازم ‌الاجرا است."

        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=5,
            subclause_name=None,
            body="عقد قرارداد اجاره صرفا یکساله می باشد و هر گونه تمدید قرارداد جهت سکونت مستاجر محترم نیازمند انعقاد قرارداد دیگر می باشد."

        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=6,
            subclause_name=None,
            body="طرفين پس از احراز هويت يکديگر، اصل سند و كليه اوراق مربوطه به رويت و قبولی طرفين قرارداد رسيده و با امضاء قرارداد مزبور بر اين امر اقرار نموده اند."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات طرفین",
            clause_number=8,
            subclause_number=7,
            subclause_name=None,
            body="مطابق توافق و تراضی طرفین قرارداد، هر گونه بدهی و ایجاد طلب توسط طرفین قرارداد قابلیت تهاتر را خواهد داشت."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات اَملاین",
            clause_number=9,
            subclause_number=1,
            subclause_name=None,
            body="املاین مسئول تعهدات هیچ یک از طرفین قرارداد نمی باشد."
        ),
        entities.ContractClause(
            clause_name="حقوق و تعهدات اَملاین",
            clause_number=9,
            subclause_number=2,
            subclause_name=None,
            body="شرکت املاین مکلف به صدور کد رهگیری حداکثر ظرف یک روز کاری از تاریخ انعقاد قرارداد برای طرفین می باشد. در صورتی که هر یک از طرفین قرارداد از ارائه کد ارسالی سامانه خودنویس به شرکت املاین خودداری نماید و یا در صورتی که مدارک مورد نیاز جهت صدور کد رهگیری اعم از گواهی تاییدیه کد پستی، شناسه قبض برق و... خودداری نماید، شرکت املاین هیچ تعهدی نسبت به صدور کد رهگیری نخواهد داشت!"
        ),
    ]
)
