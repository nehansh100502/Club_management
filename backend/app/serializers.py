from app.extensions import db
from app.models import Club, Event, User


def user_to_dict(u: User) -> dict:
    from app.models import ClubMember
    joined_ids = [m.club_id for m in ClubMember.query.filter_by(user_id=u.id).all()]
    d = {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "role": u.role,
        "joinedClubIds": joined_ids,
    }
    if u.club_id:
        d["clubId"] = u.club_id
    return d


def club_to_dict(c: Club) -> dict:
    head = db.session.get(User, c.head_id) if c.head_id else None
    return {
        "id": c.id,
        "name": c.name,
        "description": c.description or "",
        "category": c.category or "",
        "memberCount": c.member_count if c.member_count is not None else 0,
        "headId": c.head_id,
        "headName": head.name if head else "",
        "headEmail": head.email if head else "",
        "createdAt": c.created_at,
        **({"logo": c.logo} if c.logo else {}),
    }


def event_to_dict(e: Event) -> dict:
    club = db.session.get(Club, e.club_id)
    club_name = club.name if club else ""
    d = {
        "id": e.id,
        "title": e.title,
        "description": e.description or "",
        "date": e.date,
        "time": e.time,
        "location": e.location,
        "clubId": e.club_id,
        "clubName": club_name,
        "status": e.status,
        "createdBy": e.created_by,
    }
    if e.attendance_count is not None:
        d["attendanceCount"] = e.attendance_count
    return d
