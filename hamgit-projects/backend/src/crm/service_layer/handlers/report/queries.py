total_income_query = """
select sum(cp.amount) as total_commission
from contract.contract_payments cp
    left join financial.invoices fi on cp.invoice_id = fi.id
where cp.deleted_at is null
    and cp."type" = 'COMMISSION'
    and cp.status = 'PAID'
    and fi.status = 'PAID'
    and cp.created_at::date >= :start_date
    and cp.created_at::date <= :end_date
"""

file_call_count_query = """
with calls as(
    select calldate calldate,
        "OUTGOING" as type,
        case
            when result = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.outgoing_calls
    where date(calldate) >= :start_date
        and date(calldate) <= :end_date
    union all
    select calldate calldate,
        "INCOMING" as type,
        case
            when disposition = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.incoming_calls
    where date(calldate) >= :start_date
        and date(calldate) <= :end_date
)
select sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as incoming_answered,
    sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as incoming_no_answer,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as outgoing_answered,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as outgoing_no_answer
from calls c
"""

file_count_query = """
select 'landlord_files' as file_type,
    count(*) as count
from crm.landlord_files lf
where lf.created_at::date >= :start_date and lf.created_at::date <= :end_date
    and lf.deleted_at is null
union ALL
select 'tenant_files' as file_type,
    count(*) as count
from crm.tenant_files tf
where tf.created_at::date >= :start_date and tf.created_at::date <= :end_date
    and tf.deleted_at is null
"""

file_status_count_query = """
with files as (
    select lf.file_status
    from crm.landlord_files lf
    where lf.created_at::date >= :start_date and lf.created_at::date <= :end_date
        and lf.deleted_at is null
    union all
    select tf.file_status
    from crm.tenant_files tf
    where tf.created_at::date >= :start_date and tf.created_at::date <= :end_date
        and tf.deleted_at is null
)
select f.file_status as status,
    count(*) as count
from files f
group by f.file_status;
"""

contract_count_query = """
select count(*) as count
from contract.property_rent_contracts
where created_at::date >= :start_date and created_at::date <= :end_date
    and deleted_at is null
    and status in (
        'COMPLETED',
        'PDF_GENERATED',
        'PDF_GENERATING_FAILED'
    );
"""

file_count_per_day_query = """
with files as (
    select id id,
        created_at created_at
    from crm.landlord_files
    where created_at::date >= :start_date and created_at::date <= :end_date
        and deleted_at is null
    union all
    select id id,
        created_at created_at
    from crm.tenant_files
    where created_at::date >= :start_date and created_at::date <= :end_date
        and deleted_at is null
)
select created_at::date created_at,
    count(*) count
from files
group by created_at::date
order by created_at::date;
"""

contract_count_per_day_query = """
select created_at::date as created_at,
    count(*) as count
from contract.property_rent_contracts
where created_at::date >= :start_date and created_at::date <= :end_date
    and deleted_at is null
    and status in (
        'COMPLETED',
        'PDF_GENERATED',
        'PDF_GENERATING_FAILED'
    )
group by created_at::date
order by created_at::date;
"""


voip_call_user_report_query = """
with calls as(
    select callerid id,
        billsec duration,
        calldate calldate,
        "OUTGOING" as type,
        case
            when result = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.outgoing_calls
    where date(calldate) >= :start_date and date(calldate) <= :end_date
    union all
    select dst id,
        billsec duration,
        calldate calldate,
        "INCOMING" as type,
        case
            when disposition = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.incoming_calls
    where date(calldate) >= :start_date and date(calldate) <= :end_date
),
duration as(
    select id,
        sum(duration) as duration
    from calls
    group by id
),
users as(
    select distinct(callerid) id,
        callername name
    from outgoing_calls
)
select c.id,
    u.name name,
    sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as incoming_answered,
    sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as incoming_no_answer,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as outgoing_answered,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as outgoing_no_answer,
    floor(d.duration / 60) as duration
from calls c
    left join users u on c.id = u.id
    left join duration d on c.id = d.id
group by c.id,
    u.name
"""

voip_call_daily_report_query = """
with calls as(
    select calldate calldate,
        "OUTGOING" as type,
        case
            when result = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.outgoing_calls
        where date(calldate) >= :start_date and date(calldate) <= :end_date
    union all
    select calldate calldate,
        "INCOMING" as type,
        case
            when disposition = 'ANSWERED' then 'ANSWERED'
            else 'NO_ANSWER'
        end result
    from asteriskcdrdb.incoming_calls
    where date(calldate) >= :start_date and date(calldate) <= :end_date
)
select date(c.calldate) calldate,
    sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as incoming_answered,
    sum(
        case
            when c.type = 'INCOMING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as incoming_no_answer,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'ANSWERED' then 1
            else 0
        end
    ) as outgoing_answered,
    sum(
        case
            when c.type = 'OUTGOING'
            and c.result = 'NO_ANSWER' then 1
            else 0
        end
    ) as outgoing_no_answer
from calls c
group by date(c.calldate)
"""
